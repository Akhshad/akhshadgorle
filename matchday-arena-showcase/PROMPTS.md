# Prompts: recreate it exactly

The prompts below rebuild the same site. Paste them into an AI coding agent such as Claude Code, one at a time and in this order. Check the result in a browser after each step before you send the next one.

**Before you start**

- Record a screen video of the seat-picker experience you want to copy and attach it to Prompt 1. The agent copies what it can see.
- You need Node.js and an internet connection.
- Download a detailed football stadium model with a licence that allows reuse (for example, a CC-BY model from Sketchfab).

### Prompt 1: Build the whole experience

> *(Attach the reference screen recording.)*
>
> Build a 3D football stadium seat-picker website that runs in the browser with Three.js. Recreate the attached reference exactly: same steps, same camera moves, same panels. Use plain HTML, CSS and JavaScript modules, with no build step, served by a small local Node server.
>
> **Stadium**
> - Use the real stadium model I have downloaded for the bowl, roof and pitch.
> - Replace its merged seat meshes with individual seats, about 50,000 of them. Keep their exact positions and facing, and draw them with GPU instancing.
> - Group the seats into 64 blocks: 32 sectors × 2 tiers, inside 4 named stands (North, East, South, West). Each seat stores its stand, tier, block, row, seat number, price and whether it is taken. Mark about 30% of the seats as taken at random.
> - Seats are the stadium's own red. Taken seats are blue.
>
> **Flow** (each step is a smooth, eased camera flight)
> 1. **Aerial view**: the camera orbits over the stadium and the park around it. Hovering a stand lights it up and shows a chip such as "East Stand · 8,935 left · from €45". Clicking flies into that stand.
> 2. **Stand view**: hovering a block shows "East Stand · Upper tier · Block 231 · 783 left · €45". Clicking flies to that block.
> 3. **Block close-up**: real 3D seats. Hovering a seat shows "Row 13 · Seat 29", or "Taken".
> 4. **Seat chosen**: the seat turns orange and the rest of the block greys out. A ticket card appears with a live-rendered "Your view" picture from that seat, plus row, seat and gate, an **Upgrade · +€205** button and a **Keep my seat** button.
> 5. **Upgrade**: fly to a glass hospitality skybox with leather armchairs ("Skybox 18 · Front row · Seat 6 · €250").
> 6. **View from seat**: a first-person view at eye height under the real roof. Drag to look around and scroll to zoom. Show **Confirm ticket** and **Choose another seat** buttons.
> 7. **Confirm**: show a ticket with a QR code, mark the seat as taken, and fly back to the aerial view.
>
> A back button, breadcrumbs and the Esc key step back from any point. Use fictional club names for the fixture and € prices.
>
> **Live screens (extra feature)**
> - Hang two giant screens above the pitch. Each shows three football YouTube Shorts side by side.
> - Put 8 portrait screens on the hospitality ring, right beside the seats (2 per stand).
> - Each screen is a real YouTube player placed in 3D with CSS3DRenderer, behind a transparent hole punched in the WebGL canvas. That way the video moves in perfect perspective and the stadium correctly hides it.
> - Videos autoplay muted, loop through a playlist, skip broken videos, and never stay paused. A **Sound on** button plays audio from the screen nearest the camera.
> - Keep the playlists of YouTube video IDs in one config file so they are easy to change.

### Prompt 2: Make it look real

> Make it look photo-real, like the reference:
> - Use a real photographed HDRI sky for lighting and reflections, and line the sun light up with the sun in the photo.
> - Add real-time sun shadows. The roof trusses should throw stripes across the seats.
> - Build a park around the stadium: photo-scanned grass, asphalt and paving textures with normal maps, roads and paths.
> - Add thousands of trees, made by baking photo-scanned tree models into multi-angle impostor sprites so they stay cheap to draw.
> - Give the close-up seats rounded, high-detail geometry.
> - Use free CC0 assets from Poly Haven.

### Prompt 3: Phones and laptops, handled separately

> Make phones and laptops two separate experiences. The site must load fast and run smoothly on iOS, Android and laptops.
> - At start-up, detect the device and pick a quality preset. Allow forcing one with `?mobile` and `?desktop`.
> - **Laptop**: hover to preview, click to choose, scroll to zoom. Glass blur panels. Up to 6 live screens (the ones nearest the camera).
> - **Phone**: tap to preview, tap again to choose, pinch to zoom in the seat view. Solid panels with no blur, big touch targets, layouts that respect the notch and home bar, in portrait and landscape. Up to 3 live screens.
> - Only treat weak Android phones (3 GB of RAM or less, or 4 cores or fewer) as low-end. iPhones hide their RAM, so never mark them low-end.
> - Compress every asset: textures to WebP, a smaller sky image for weak phones. Download files in parallel. Keep the first load to about 11 MB on a laptop and 7 MB on a weak phone.
> - Add a `?hq` mode for strong GPUs: ambient occlusion, 4K soft shadows, clear-coat seats, all screens live.

### Prompt 4: Very smooth, no lag, no black screens

> It must be very smooth on every device, with no lag and no black-screen glitches. Then test it with automated browser runs at laptop and phone sizes, measuring frame times and every stall longer than 50 ms.
> - **Render on demand**: when the camera is still and nothing has changed, draw no frame. Redraw at least once a second as a safety net.
> - **Cached shadows**: re-render the shadow map only when the area it covers moves. For a camera flight, render one shadow map that covers the whole route.
> - **Per-block culling**: skip blocks behind the camera. Distant seats use about 10 triangles each.
> - **Dynamic resolution**: measure the browser's own frame cadence, so a 30 fps cap (iOS Low Power Mode) is not mistaken for a slow device. Lower the resolution in small steps only after two slow windows in a row, and never below 1.5× on phones.
> - **No mid-flight stalls**: during loading, compile every shader and upload every texture, including objects that start hidden.
> - **"Your view" picture**: render it into its own small target and read it back asynchronously.
> - **Live screens**: swap video players only after the camera has been still for 1 s (2 s on phones) with no finger down. Keep showing the placeholder until the video is really playing.
> - **Black screens**: redraw in the same frame after a resize, on returning to the tab, and after a WebGL context restore (rebuild the sky lighting then).
> - **Phone quality**: phones get 2× resolution, anti-aliasing, 2048 shadow maps, the 2K sky and rounded close-up seats. Phones must look sharp, not blurry.

### Prompt 5: Preloader

> Add a simple preloader: one football in the middle that bounces up and down. Use gravity easing, squash and stretch when it lands, spin, and a floor glow that grows on landing. Show the site name and a thin progress line below it. Animate only transform and opacity so it stays smooth while the 3D scene builds. Fade from the preloader into the stadium fly-in.

### Prompt 6: Refresh button

> Add a Refresh button. On a laptop, put it in the top bar next to Sound. On a phone, put it under the sound button. Tapping it reloads the whole site and starts again from the preloader. Show the preloader straight away on tap, so there is no blank flash.

### Prompt 7: Colour grade

> Colour grade it. It must not look grey or washed out: real colour, strong contrast, deep vivid grass greens (not yellow-lime) and rich reds. Do the grade inside the tone-mapping shader rather than as a CSS filter: a neutral PBR tone curve, a contrast S-curve and about 1.3 saturation. Keep whites and greys clean.

### Prompt 8: Ship it

> Run a full check on laptop and phone sizes. Then commit everything to a strictly private GitHub repository. Add a small build step that copies only the files the site needs into a folder, and deploy that folder as static assets to Cloudflare, with long cache lifetimes for the heavy assets.

**Tips**

- If a step comes out wrong, attach a screenshot and describe what is off.
- Keep the agent testing on both a phone and a laptop screen size after every change. Smoothness problems usually show up on phones first.
