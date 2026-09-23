# ACANTO SELVA — B-2

Independent static website, forked from the current B-1 working files in `../Acnato`.
HTML + CSS + JavaScript modules + locally vendored Three.js. No build or install required.

## Preview

```sh
python3 -m http.server 4174 --bind 127.0.0.1
```

Open http://localhost:4174/ . Do not open index.html via file:// (STL and module loading require HTTP).

## Files

- `index.html`: page content and import map
- `src/hero-b2.js`: real STL rendering, studio lighting and scroll-driven camera
- `src/hero-shots.js`: camera distances and rotations at scroll keyframes
- `src/hero-b2.css`: B-2 opening layout
- `src/styles.css`, `src/app.js`, `src/knot-viewer.js`: copied B-1 lower sections
- `public/assets/b2`: supplied visual references and fallback
- `design-system`: copied brand tokens
- `docs/CURRENT_STATE.md`: handoff status

The three hero images are visual references, not animation frames. STL has no materials;
the dark metal is reconstructed with environment lighting. Exact photographic matching
requires visual calibration. Desktop is the current design target.

## GitHub

This is an independent Git repository. Add your desired new GitHub repository URL:

```sh
git remote add origin <NEW_REPOSITORY_URL>
git push -u origin main
```

Do not point this at B-1's repository unless intentionally merging the two projects.
No credentials are stored here. No deployment is automatic.
