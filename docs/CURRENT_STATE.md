# Home2 current state — 2026-09-28

Source: Figma x4nfgBPLslK1Igxk9ToQmQ, latest Home2/Desktop/1920 (1715:664).
Design context was freshly read from the latest root and its Symbol state frames.

HTML and CSS are rebuilt from Home2. Old B-1 source copies were removed from B-2;
they remain recoverable in the initial Git commit. Original ../Acnato is untouched.

The implemented flow is Index → Hero → Manifesto → Object → Origin → Symbol →
Manifesto 3 → Our Standard → Arrival → Footer. The latest Figma copy, Origin layout,
Standard mosaic, Arrival lockup and plain Footer are reflected in the HTML/CSS. Latest
exported Figma imagery lives under `public/assets/home2-latest/`.

Hero runs real STL motion with added scroll travel. The sequence is
zoom → copy reveal → centered Y rotation → silhouette-led left-to-right copy wipe.
The camera moves only on Z and always looks at the origin, so the ring remains centered.
The wipe now starts only after the ring reaches the copy. Once the ring has covered the
copy, the heading is removed from rendering so no residual letters can show through.

Symbol uses a sticky title and stage with a 24px design-space gap. Scroll order is
Eye → Knot → Labyrinth. Each transition starts with a short 1:1 scroll response,
then a half-rate response; crossing the threshold starts a 3.4s slow-launch timeline
that finishes independently instead of continuing to scrub 1:1. Copy fades fully out
before image movement, images move/resize, pause briefly, then crossfade; the next copy
fades in only after its hidden repositioning is complete. The same continuous timeline
runs in reverse on upward scrolling. Layout and final positions follow the three Figma
state frames. The latest Figma node has no canvas keyframes, so the requested motion
timing lives in `src/symbol-scroll.js`.

All sans-serif copy uses bundled Pretendard at the latest Figma sizes, weights, line
heights and tracking. Unico/Unico Caps remain limited to the designated display marks.
Material remains a realtime approximation.

Preview: http://localhost:4182/ with explicit --directory path in README.
Previous port 4174 returned older HTML; do not use it for verifying this rebuild.
