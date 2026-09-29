# ACANTO SELVA — Home2 / B-2

Fresh HTML and CSS implementation of the latest Figma Home2/Desktop/1920, node 1715:664.
B-1 in ../Acnato is on hold and untouched. Only assets and the 3D engine are reused.

## Preview

```sh
python3 scripts/dev-server.py 4182 /Users/t24-5/Documents/GitHub/AcantoSelva
```

Open http://localhost:4182/ . Use HTTP, not file://. Use this server, not plain
`python3 -m http.server` — it adds `Cache-Control: no-store` to every response, which
plain http.server doesn't; without it a tab can keep serving a stale build (a
hash-only navigation never re-fetches the document either way — reload or open a
fresh tab to see a new build).

## Source files

- index.html: complete Home2 semantic structure with Figma node IDs
- src/home2.css: independent layout, typography and visible 1920px proportions
- src/main.js: shared entry point; starts section isolation before loading 3D
- src/motion-runtime.js: GSAP / ScrollTrigger shared ticker and scene lifecycle
- src/section-transitions.js: smoothed scroll, section isolation, covered scene changes
- src/nav-ui.js: left dash section indicator, scroll-to-top FAB, decorative hamburger
- src/scroll-reveal.js: scroll-in reveal for Object/Origin photo groups
- src/hero-b2.js: real 3D renderer using a preprocessed, indexed copy of the original STL
- src/hero-shots.js: scroll camera and rotation keyframes
- src/symbol-scroll.js: sticky Eye → Knot → Labyrinth scroll choreography
- public/assets/home2-latest/: latest exported Figma assets
- AGENTS.md / CLAUDE.md: shared collaboration instructions
- docs/CURRENT_STATE.md: dense prose snapshot of current behavior — read this first

Flow: Index → HeroBanner → Manifesto → Object → Origin → Symbol → Manifesto 3 →
Our Standard → Arrival → Footer. Inactive scenes remain invisible and inert until
the white transition cover is opaque. Arrival and Footer share one continuous scene.

HeroBanner reserves 215vh of scroll travel before 3D loads; its visible stage keeps the
1920×1080 design ratio. The ring stays centered through zoom, copy reveal, rotation,
and a left-to-right copy wipe after the ring reaches the copy. Symbol keeps its title
and stage fixed while its two images and description move between Figma-defined state
positions. Reduced motion skips easing and fades; WebGL/model failure shows the
product-image fallback without changing the reserved scroll height.
All sans-serif copy, including the Manifesto and Hero banner, uses bundled Pretendard.
Desktop is in scope. No mobile redesign is inferred.

## Motion and model maintenance

GSAP 3.15.0 and ScrollTrigger are vendored locally under `public/vendor/gsap/`.
Scroll smoothing is one persistent per-frame follow loop (`followTick()` in
section-transitions.js), not a tween restarted per input event — that was too slow
to visibly progress under trackpad/Magic Mouse's high-frequency small deltas. Hero
consumes ScrollTrigger progress directly, without a second lag filter. Symbol uses
one reversible timeline with
image movement, a 0.2–0.25s pause, crossfade and then description reveal. It preserves
the orthogonal routes and final Figma coordinates, using transforms and crop masks.

`scripts/prepare-hero.py` converts the source `knot.stl` to `knot-web.glb` (numpy needed).
It preserves all 281,714 triangles and exact vertex positions, shares duplicate
vertices, and precomputes the original smooth normals, centering and orientation.
The runtime does not process STL normals. No video, GIF or image sequence is used.
The shader is compiled and the first frame rendered before the canvas is exposed.

Do not commit or push without an explicit user request.

## GitHub

Independent local Git repository. Remote/deployment is not configured.
Set the intended new repository URL and push when ready:

```sh
git remote add origin <NEW_REPOSITORY_URL>
git push -u origin main
```
