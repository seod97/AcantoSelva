# Home2 current state — 2026-09-29

Source: Figma x4nfgBPLslK1Igxk9ToQmQ, latest Home2/Desktop/1920 (1715:664).
The Figma file is edited live and continuously; always re-fetch a node's
`get_design_context`/`get_metadata` fresh before trusting a remembered value —
several bugs this session came from trusting a stale fetch (see below).

HTML and CSS are rebuilt from Home2. Old B-1 source copies were removed from B-2;
they remain recoverable in the initial Git commit. Original ../Acnato is untouched.

The implemented flow is Index → Hero → Manifesto → Object → Origin → Symbol →
Manifesto 3 → Our Standard → Arrival → Footer. The latest Figma copy, Origin layout,
Standard mosaic, Arrival lockup and plain Footer are reflected in the HTML/CSS. Latest
exported Figma imagery lives under `public/assets/home2-latest/`.

GSAP 3.15.0 / ScrollTrigger are vendored locally. `src/main.js` initializes scene
isolation first and imports the 3D module asynchronously. All controllers use the
same GSAP ticker. Wheel/keyboard/touch scroll is eased once over a persistent
per-frame follow loop (`followTick()` in section-transitions.js), not a fresh tween
per input event — that per-event-tween approach is what made trackpad/Magic Mouse
scrolling barely move anything (each new tween got killed and restarted before it
could progress). Layout bounds are measured on refresh, not on every wheel event or
render frame.

Only the active section and its descendants are visible and interactive. Other
sections keep their layout footprint, but are inert/aria-hidden. This also guards
against early exposure through native scrollbar drags, anchors, browser Find and
reverse scroll. Arrival and Footer are a single visible, continuous group.
At a boundary, ~150px of extra intent (capped 200px per event, minimum 90ms dwell)
triggers a 0.5s cover-fade followed by a 0.7s reveal via `.section-transition-veil`
(z-index 9999). Scene selection, scroll placement and animation state restoration
occur only under the fully opaque cover. The next scene starts at its bound.start;
reverse navigation restores the previous scene's bound.end. Symbol must finish its
current motion (`isMoving()`) before leaving. Reduced motion skips easing and fades.
Hash-link navigation (the side-nav / any `href="#id"`) always jumps to that section's
bound.start regardless of direction — it does not do a bound.end backward entry.

`section-transitions.js`'s `measure()` sizes each section's scrollable range off its
own sticky-pinned child's height (Hero's `.b2-stage`, Symbol's `.symbol-pin`) when one
exists, not off `innerHeight` — using `innerHeight` there let this system decide a
section had ended before that section's own internal ScrollTrigger reached progress 1,
which made Symbol's Labyrinth state unreachable on some viewport sizes. The shared
`tween()` helper in `motion-runtime.js` now has a watchdog: if a GSAP tween goes
`ms + 600` past its expected duration without firing `onComplete`/`onInterrupt` (a rare,
unreproduced case where a tween stops ticking entirely and used to hang `change()`
forever), it force-issues a duration:0 tween on the same target, which relies on GSAP's
default same-target auto-overwrite to unstick the frozen one.

`src/nav-ui.js` adds three fixed-position, non-section UI pieces, none of which are
in Figma — built from direct requests, not a node. A left-edge dash indicator (one
per section, 12×2px, scales 1.5× on hover/active) is positioned at runtime, not in
CSS, by `positionSideNav()`: it measures the real left edge of section content (the
shared `.section-shell` padding) and floats the dash inside that gutter with a 17px
minimum clearance from content that always wins over the ideal 16px clearance from
the screen edge if the two conflict on a narrow window — content size/margins are
never adjusted to make room for it. A bottom-right "scroll to top" FAB. A top-right
hamburger (`.gnb-toggle`, decorative — no menu wired up) that is always visible,
including mid-transition: it sits above the transition veil (z-index 10000 vs the
veil's 9999) and uses `color:#fff` + `mix-blend-mode:difference` so it auto-inverts
against whatever is behind it (black bg → white icon, arbitrary dark colors → their
photographic-negative complement) instead of tracking scroll direction or reading
the background itself.

`src/scroll-reveal.js` gives the Object section's Guardian/Bold photo rows and the
Origin section's four photo groups a calm fade+rise-from-above reveal (opacity 0→1,
y -36→0, 0.9s power2.out, 0.12s stagger within a group) the first time each group
scrolls into view, excluding Object's lead hero shot. It replays every time the
section is re-entered (not once per page load): each section's `registerScene` sync
callback — which already fires on every activation, forward or backward, per the
scene-lifecycle contract above — kills and recreates that section's ScrollTriggers,
resetting the groups to hidden first. A group whose trigger point is already behind
the viewport at re-arm time (a backward hash-jump can land past it) plays immediately
instead of relying on ScrollTrigger's initial-state evaluation, which does not
reliably fire `onEnter` for a point that was already past when the trigger was
created.

Do not commit or push without an explicit user request.

Hero runs real 3D geometry derived from the original STL, with added scroll travel
(215vh — the midpoint between an earlier 170vh and a pre-tuning 260vh, per explicit
request). The sequence is zoom → copy reveal → centered Y rotation → silhouette-led
left-to-right copy wipe. The camera moves only on Z and always looks at the origin,
so the ring remains centered. The wipe now starts only after the ring reaches the
copy. Once the ring has covered the copy, the heading is removed from rendering so no
residual letters can show through.
The original 14,085,784-byte STL is preprocessed by `scripts/prepare-hero.py` into
a 6,765,312-byte GLB. All 281,714 triangles and vertex positions are retained; indexing
reduces submitted vertices from 845,142 to 140,995 and removes runtime normal averaging.
The reserved scroll height does not change when the model loads. The shader and first
frame are prepared before the canvas becomes visible. Draws happen only while the
Hero is current and dirty, with pixel ratio capped at 1.5. Loading/WebGL failures use
the existing product image. No GIF, video or image sequence is involved.

Symbol uses a sticky title and stage with a 24px design-space gap. Scroll order is
Eye → Knot → Labyrinth. A subtle preview precedes the automatic timeline. Eye → Knot
takes 3.2s and Knot → Labyrinth 3.4s (capped to a max 1.1s real-time tween so the
settle animation can't block the next-section scroll gate); reversing mid-motion uses
the same playhead. Descriptions fade out before movement, images move and hold for
0.2–0.25s, then crossfade, and the next description fades in. Figma coordinates and
strictly horizontal/vertical routes are preserved. Transforms and a crop mask replace
per-frame left/top/width/height writes, without stretching image pixels. Text is
top-aligned for Eye and bottom-aligned for Knot/Labyrinth.

Object (`1715:674`) is three absolutely-positioned blocks inside `.object-frame`
(95cqw × 190.8333cqw): the hero shot + description (no separate heading — Figma
dropped that bold line; only the body paragraph remains, 20px Regular, top-aligned
24px below the image, not the taller bottom-anchored box from an earlier pass),
Guardian Symbol Series (knot/eye/labyrinth), and Bold Open Series (a/b/c placeholders).
Every absolute offset in both rows was re-derived from raw Figma node metadata
(`get_metadata`, not the JSX/Tailwind dump) after two real bugs surfaced from trusting
the JSX conversion: `object_GuardianKnot` and `object_Bold03` both carry a Figma
`-translate-x-1/2` on top of their `left: calc(50% ± Npx)`, which the JSX dump does
not visually resolve — missing that put the knot 450px right of its true `left:0`
(overlapping the eye image) and put Bold03 450px further right than its true position
(overflowing the row). The two "Eye, Knot, Labyrinth" captions also differ from each
other: Guardian's has no explicit text-align in Figma (so it's left, not centered —
an earlier pass wrongly added center), Bold's is explicitly `text-right`. Guardian's
caption sits at a fixed `top:58.125cqw` (1116px); Bold's has moved twice during this
session (Figma edited live) and is currently `top:30cqw` (576px) — re-check this one
specifically if it looks off, it is the most recently touched value in the file.

Origin (`1727:1045`) was rebuilt to match a fresh Figma pass: Acanthus/Nomad stay a
side-by-side pair (now a stone-column photo and a black-coat portrait), but the old
absolutely-positioned "null spacer + small synthesis box" and the diagonal-corner
Manifesto-3-style caption layout are gone. The three image blocks
(`.origin-pair`, `.origin-synthesis-01`'s small image + 7-keyword caption row,
`.origin-synthesis-02`'s full-width image with an "Acanthus X Nomad" overlay) are
plain flex rows with a 12.5cqw gap between them, matching Figma's `gap-[240px]`
container. Image-to-slot mapping was inferred from aspect ratio, not stated by the
user: the two square photos went to Acanthus/Nomad, the near-square portrait
(0.925:1) matched the small synthesis slot (592×640) almost exactly, and the wide
landscape (2.368:1) matched the large synthesis slot (1516×640) almost exactly.

Manifesto 01 (`1715:672`, "Creation is Judgment") is 32px Pretendard Medium with a
32px gap to the mark and 0.32px tracking (was 40px/600-weight/no-tracking; corrected
against a fresh Figma fetch). Manifesto 03 (`1715:772`, the closing-quote section) was
restructured from a top-left/bottom-right diagonal pair into Figma's current layout:
a left-aligned quote block and a right-aligned "Acanto Selva" label, both vertically
centered at `left:24px`/`right:24px`, with the mark centered independently between
them — not part of the same flex row as the text.

All sans-serif copy uses bundled Pretendard at the latest Figma sizes, weights, line
heights and tracking. Unico/Unico Caps remain limited to the designated display marks.
Material remains a realtime approximation. The Index lockup is explicitly centered,
the intentional Origin null block is transparent, and Symbol descriptions align to the
top or bottom of their Figma text frame as each state changes.

Preview: `scripts/dev-server.py <port> <dir>` — not plain `python3 -m http.server` —
because it adds `Cache-Control: no-store` to every response; the plain stdlib server
sent no cache headers at all, and a browser tab that had loaded an older build could
keep serving stale HTML/CSS/JS/images indefinitely, including across hash-only
navigations (which never re-fetch the document — a full reload or a fresh tab is
still required to pick up a new build even with no-store). Default port 4182.
