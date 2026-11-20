# How we made it

## 1. Studying the reference
We started by recording a reference seat-picker experience. We broke it into its steps: stadium, stand, block, seat, then the view from the seat. For each step we noted the camera move, what the user can hover or tap, and which panel appears. That list became the checklist for an exact recreation.

## 2. Choosing the approach
Everything runs in the browser with WebGL (Three.js). There is no game engine, no plugin and no app to install. The page is static: HTML, CSS, a few JavaScript modules, and binary assets served from a CDN edge.

## 3. Building the stadium
- **Bowl**: a detailed stadium model, cleaned up and compressed. Its textures were converted to WebP.
- **Seats**: the original seats were replaced with our own generated seats, tens of thousands of them. They are drawn with GPU instancing, so the whole stadium costs only a few draw calls. Each seat knows its stand, tier, block, row, number, price and whether it is taken.
- **Blocks**: seats are grouped into 64 blocks. Each block has its own mesh, so blocks that are off screen are skipped.
- **Near and far detail**: the block you zoom into uses rounded, high-detail seats. Everything else uses very low-poly seats that look identical from a distance.

## 4. Making it look real
- An HDR sky provides image-based lighting and reflections.
- A sun casts real-time shadows across the bowl, the roof trusses and the pitch.
- A generated ground with paths, plus thousands of instanced trees, makes up the park around the stadium.
- A custom tone-mapping curve gives a rich, broadcast-style colour grade. It is built into the shader, so it costs nothing extra.
- Laptops get an extra "high quality" mode with soft shadows, ambient occlusion and physically based seat materials.

## 5. The flow and interactions
- Smooth, eased camera flights connect every step.
- Hovering on a laptop, or tapping on a phone, highlights a stand or block and shows a price chip.
- Picking a seat renders a small "your view" image from that exact seat, in the background, for the ticket.
- "Your view" places the camera at eye height in the seat so you can look around.
- Fans can upgrade to a skybox and see the view from it.
- A confirmation screen closes the flow.

## 6. Live screens
Screens hang under the stand tiers and play short football clips. Real video players are placed exactly behind transparent "holes" in the 3D canvas, so each video looks as if it lives inside the stadium. Only the screens nearest the camera play live video, and players are swapped only when the camera is still. All other screens show a branded placeholder.

## 7. Phones and laptops, handled separately
At start-up the page detects the device and picks a quality preset:

| | Laptop | Phone |
|---|---|---|
| Sharpness | 1.5× (2× in HQ mode) | 2× |
| Edge smoothing | Yes | Yes |
| Shadow map | 2048 (4096 in HQ mode) | 2048 |
| Live video screens | Up to 6 | Up to 3 |
| Controls | Hover, click, drag, scroll | Tap to preview, tap again to choose, pinch to zoom |

The phone layout respects notches and home bars, uses full-height layouts, and has large tap targets. It also avoids heavy blur effects.

## 8. Making it smooth
- **Draw only when something changes.** When nothing moves, the GPU does almost no work.
- **Cached shadows.** Shadows are recomputed only when the scene changes, never every frame. During a flight, one shadow area covers the whole route.
- **Everything is prepared up front.** All shaders and textures are compiled and uploaded during loading, so nothing stalls mid-flight.
- **Adaptive resolution.** If a device truly can't keep up, sharpness is lowered gently. The check is aware of the frame rate, so phones capped at 30 fps (such as iPhones in Low Power Mode) are not mistaken for slow devices.
- **No black screens.** The page redraws after resizes, tab switches and GPU resets, and it rebuilds the lighting if the graphics context is lost.

## 9. Testing
Every change was checked with automated browser runs on laptop and phone screen sizes. These runs recorded frame times, stalls longer than 50 ms, resolution under simulated Low Power Mode, black-frame checks, and console errors. Old and new builds were compared side by side.

## 10. Shipping
The code lives in a private repository. A small build step copies only the files the site needs into a folder. That folder is deployed as static assets to a global CDN edge with long cache lifetimes for the heavy assets.
