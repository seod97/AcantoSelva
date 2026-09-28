# Home2 current state — 2026-09-28

Source: Figma x4nfgBPLslK1Igxk9ToQmQ, Home2/Desktop/1920 (1582:30).
Design context was freshly read after the Object frame changed to node 1695:432.

HTML and CSS are rebuilt from Home2. Old B-1 source copies were removed from B-2;
they remain recoverable in the initial Git commit. Original ../Acnato is untouched.

At 1920px: Index 1080 high; Hero visible stage 1080; Manifesto 1080;
section gaps 120; Object outer padding 48 horizontal / 24 vertical;
Object content 1824×2244, title at left and lead 1362×600 at x462;
second row y852, 592-wide cards; Eye image 1260 high; small image y1752;
reserved section 1080; footer 720.

Hero 1602:265 alone runs real STL motion with added scroll travel. The sequence is
zoom → copy reveal → centered Y rotation → silhouette-led left-to-right copy wipe.
The camera moves only on Z and always looks at the origin, so the ring remains centered.
Figma images are downloaded locally. Blank image slots match Figma, not B-1 assets.
The latest Figma node has no canvas keyframes, so Figma supplies layout/copy while the
requested interaction timing lives in `src/hero-shots.js` and `src/hero-b2.js`.
Noto Sans is not bundled; text falls back to Pretendard. Material remains a realtime approximation.

Preview: http://localhost:4182/ with explicit --directory path in README.
Previous port 4174 returned older HTML; do not use it for verifying this rebuild.
