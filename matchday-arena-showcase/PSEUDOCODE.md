# Pseudocode

This is a high-level description of how the app works. It is plain-language pseudocode, not real code.

---

## Start-up

```
ON PAGE LOAD
    device  ← detect phone / laptop, touch / mouse, memory, cores
    preset  ← pick quality preset for device      // sharpness, shadows, video screen count
    show loading bar

    IN PARALLEL
        download stadium model
        download seat layout
        download sky image

    build world:   sky lighting, sun + shadows, ground, park, trees
    build stadium: bowl, roof, pitch
    build seats:   one instanced mesh per block (far detail)
                   + one high-detail mesh for the active block
    build screens: placeholders under each tier

    pre-compile every shader, upload every texture   // no stalls later
    hide loading bar
    fly camera to AERIAL view
    start render loop
```

## The flow

```
STATE mode ∈ { AERIAL, STAND, BLOCK, SEAT, VIEW, SKYBOX }

ON hover/tap in AERIAL
    stand ← pick stand under pointer
    highlight stand, show availability chip
    IF click (or second tap on the same stand) → goStand(stand)

goStand(stand)
    mode ← STAND
    flyTo(camera pose framing that stand)

ON hover/tap in STAND
    block ← pick block under pointer
    show chip: tier, block number, price, seats left
    IF click (or second tap) → goBlock(block)

goBlock(block)
    mode ← BLOCK
    swap block to high-detail seats
    paint seats: free = highlight colour, taken = blue
    flyTo(camera pose above the block)

ON hover/tap in BLOCK
    seat ← pick nearest free seat under pointer
    IF click (or second tap) → goSeat(seat)

goSeat(seat)
    mode ← SEAT
    mark seat as selected
    flyTo(close-up of seat)
    IN BACKGROUND render small image from seat's eye position → ticket preview
    show ticket: stand, block, row, seat, gate, price, upgrade button

goView(seat)
    mode ← VIEW
    flyTo(eye height in the seat, looking at the pitch)
    allow look-around only
    show "Confirm ticket" / "Choose another seat"

BACK button → return to the previous mode
```

## Camera flights

```
flyTo(targetPose, duration)
    from ← current camera pose
    set shadow area to cover both start and end of route   // shadows drawn once
    EACH FRAME
        t ← ease-in-out(elapsed / duration)
        camera ← interpolate(from, targetPose, t)
    ON END
        enable controls for the new mode
```

## Render loop (draws only when needed)

```
EVERY ANIMATION FRAME
    dirty ← camera moved
         OR seats repainted
         OR screens changed
         OR flight in progress
         OR window resized
         OR more than 1 second since the last draw   // safety net

    IF NOT dirty → skip (GPU stays idle)

    IF shadows marked stale → re-render shadow map once
    render scene
    position live video players behind their screen holes
    adapt quality()
```

## Adaptive quality

```
adapt quality()
    cadence ← measured natural frame interval of this device   // 16 ms, or 33 ms when capped
    budget  ← max(21 ms, cadence × 1.35)

    IF two consecutive windows are slower than budget
        step down, one at a time:
            turn off ambient occlusion (HQ only)
            lower sharpness slightly (never below the preset minimum)
            shrink shadow map
```

## Live screens

```
EVERY 1.5 s, ONLY WHILE CAMERA IS STILL AND NOT TOUCHED
    rank screens by distance + visibility to camera
    keep the top N live (N from preset), with hysteresis to avoid flicker
    stagger new players ~1 s apart
    others → static placeholder

WHEN a player actually starts playing
    reveal transparent hole so the video shows through the 3D scene
```

## Staying robust

```
ON tab visible / page shown / window focused → redraw now
ON resize (only if size or pixel ratio really changed) → resize + redraw now
ON graphics context lost → prevent default, wait
ON graphics context restored → rebuild sky lighting, mark shadows stale, redraw
```
