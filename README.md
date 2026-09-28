# ACANTO SELVA — Home2 / B-2

Fresh HTML and CSS implementation of Figma Home2/Desktop/1920, node 1582:30.
B-1 in ../Acnato is on hold and untouched. Only assets and the 3D engine are reused.

## Preview

```sh
python3 -m http.server 4182 --bind 127.0.0.1 --directory /Users/t24-5/Documents/GitHub/AcantoSelva
```

Open http://localhost:4182/ . Use HTTP, not file://.

## Source files

- index.html: complete Home2 semantic structure with Figma node IDs
- src/home2.css: independent layout, typography and visible 1920px proportions
- src/hero-b2.js: real STL renderer scoped to the HeroBanner only
- src/hero-shots.js: scroll camera and rotation keyframes
- public/assets/b2/home2-*.png: exact exported Figma assets
- AGENTS.md / CLAUDE.md: shared collaboration instructions

Flow: Index → HeroBanner → Manifesto → Object → reserved blank section → footer.
No B-1 navigation, Origin, Symbol, Standard or fade controllers are loaded.
Object placeholders follow the current Figma wireframe intentionally.

HeroBanner adds 260vh of scroll travel when 3D loads; its visible stage keeps the
1920×1080 design ratio. The ring stays centered through zoom, copy reveal, rotation,
and a left-to-right copy wipe behind the ring silhouette. Reduced motion and load
failure keep the static section height.
Noto Sans is not bundled; manifesto/banner use available Noto Sans or Pretendard fallback.
Desktop is in scope. No mobile redesign is inferred.

## GitHub

Independent local Git repository. Remote/deployment is not configured.
Set the intended new repository URL and push when ready:

```sh
git remote add origin <NEW_REPOSITORY_URL>
git push -u origin main
```
