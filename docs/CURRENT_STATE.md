# Home2 current state — 2026-09-28

Source: Figma x4nfgBPLslK1Igxk9ToQmQ, latest Home2/Desktop/1920 (1715:664).
Design context was freshly read from the latest root and its Symbol state frames.

HTML and CSS are rebuilt from Home2. Old B-1 source copies were removed from B-2;
they remain recoverable in the initial Git commit. Original ../Acnato is untouched.

The implemented flow is Index → Hero → Manifesto → Object → Origin → Symbol →
Manifesto 3 → Our Standard → Arrival → Footer. The latest Figma copy, Origin layout,
Standard mosaic, Arrival lockup and plain Footer are reflected in the HTML/CSS. Latest
exported Figma imagery lives under `public/assets/home2-latest/`.

GSAP 3.15.0 / ScrollTrigger are vendored locally. `src/main.js` initializes scene
isolation first and imports the 3D module asynchronously. All controllers use the
same GSAP ticker. Wheel/keyboard/touch scroll is eased once over 0.42s; scene progress
does not add a second smoothing filter. Layout bounds are measured on refresh, not
on every wheel event or render frame.

Only the active section and its descendants are visible and interactive. Other
sections keep their layout footprint, but are visibility:hidden and inert. This
also guards against early exposure through native scrollbar drags, anchors, browser
Find and reverse scroll. Arrival and Footer are a single visible, continuous group.
At a boundary, 300px of extra intent (150px max per event, minimum 160ms) triggers a
0.5s white cover followed by a 0.7s reveal. Scene selection, scroll placement and
animation state restoration occur only under the fully opaque cover. The next scene
starts at the top; reverse navigation restores the previous scene's bottom state.
Symbol must finish its current motion before leaving. Reduced motion skips easing
and fades. Scrollbars remain present so width never shifts. Initial hash navigation
is explicitly restored; browser automatic scroll restoration is disabled.

Do not commit or push without an explicit user request.

Hero runs real 3D geometry derived from the original STL, with added scroll travel. The sequence is
zoom → copy reveal → centered Y rotation → silhouette-led left-to-right copy wipe.
The camera moves only on Z and always looks at the origin, so the ring remains centered.
The wipe now starts only after the ring reaches the copy. Once the ring has covered the
copy, the heading is removed from rendering so no residual letters can show through.
The original 14,085,784-byte STL is preprocessed by `scripts/prepare-hero.py` into
a 6,765,312-byte GLB. All 281,714 triangles and vertex positions are retained; indexing
reduces submitted vertices from 845,142 to 140,995 and removes runtime normal averaging.
The reserved scroll height does not change when the model loads. The shader and first
frame are prepared before the canvas becomes visible. Draws happen only while the
Hero is current and dirty, with pixel ratio capped at 1.5. Loading/WebGL failures use
the existing product image. No GIF, video or image sequence is involved.

Symbol uses a sticky title and stage with a 24px design-space gap. Scroll order is
Eye → Knot → Labyrinth. A subtle preview precedes the automatic timeline. Eye → Knot
takes 3.2s and Knot → Labyrinth 3.4s; reversing mid-motion uses the same playhead.
Descriptions fade out before movement, images move and hold for 0.2–0.25s, then
crossfade, and the next description fades in. Figma coordinates and strictly
horizontal/vertical routes are preserved. Transforms and a crop mask replace
per-frame left/top/width/height writes, without stretching image pixels. Text is
top-aligned for Eye and bottom-aligned for Knot/Labyrinth. The latest saved Figma
context has no canvas keyframes; choreography follows the user's requested sequence.

All sans-serif copy uses bundled Pretendard at the latest Figma sizes, weights, line
heights and tracking. Unico/Unico Caps remain limited to the designated display marks.
Material remains a realtime approximation. The Index lockup is explicitly centered,
the intentional Origin null block is transparent, and Symbol descriptions align to the
top or bottom of their Figma text frame as each state changes.

Preview: http://localhost:4182/ with explicit --directory path in README.
Previous port 4174 returned older HTML; do not use it for verifying this rebuild.
