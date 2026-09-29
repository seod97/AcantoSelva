# Shared Claude / Codex instructions

Both agents are equal contributors to this B-2 repository.
Read `docs/CURRENT_STATE.md` and the files relevant to the request before editing.
B-1 is located in `../Acnato`; never change it as part of B-2 work.

## Concurrent work

- Do not commit or push unless the user explicitly requests it. Leave changes available to review locally.

- Run git status before edits. Preserve other contributors' changes.
- For simultaneous edits of different tasks, use separate branches and git worktrees.
- Do not edit the same shared file concurrently. Coordinate file ownership in the task.
- Commit only files belonging to your task. Never reset, force-push or clean others' work.
- Update CURRENT_STATE when behavior or entry points change.

## Design and implementation

- Opening uses real 3D STL geometry. Do not substitute image scaling or crossfades.
- Camera and rotation keyframes belong in src/hero-shots.js.
- Layout source is the latest Home2/Desktop/1920 frame (1715:664). Use index.html and src/home2.css.
- Do not reintroduce B-1 HTML, navigation or styles. Home2 now includes the complete latest flow through Footer.
- Symbol motion belongs in src/symbol-scroll.js. Preserve the fixed title/stage and the Eye → Knot → Labyrinth sequence.
- Test loading, scroll forward/backward, resizing and reduced motion.
- Keep image fallback on WebGL/STL failure. Keep imports and model URLs repo-relative.
- No API keys or external runtime services required.
- File ownership, so agents don't collide or duplicate logic:
  - src/motion-runtime.js — shared GSAP ticker, `registerScene`/`scenes` map, the `tween()` helper (has a stuck-tween watchdog, do not remove it).
  - src/section-transitions.js — scroll-hijack core: measure/select/place/change, the veil transition, wheel/touch/key input.
  - src/nav-ui.js — the left dash indicator, scroll-to-top FAB, and hamburger. None of these three are in Figma; they came from direct requests.
  - src/scroll-reveal.js — the Object/Origin photo-group scroll-in reveal. Add new sections' reveals here, not a new file.
  - src/main.js — wiring/init order only. `initScrollReveal()` must run after `initSections()`'s first `place()`/`select()`, not before.
  - scripts/dev-server.py — the local dev server. Always use this (not `python3 -m http.server`) — it sends `Cache-Control: no-store`, which plain http.server doesn't, and its absence caused repeated stale-build confusion this project has already hit more than once.
- Figma (x4nfgBPLslK1Igxk9ToQmQ) is edited live by the user. Never trust a remembered node value across a session gap — re-fetch `get_design_context`/`get_metadata` fresh. For pixel offsets, prefer `get_metadata`'s raw x/y over the JSX/Tailwind dump: the dump can carry an unresolved `-translate-x-1/2` on top of a `left: calc(...)`, which reads as the pre-transform position, not the true one (bit Object's Guardian knot and Bold03 twice).
- Don't add heading/subtitle text back into a section just because an older version of this file had it — Figma is the source of truth for whether it's still there, not this file's own history.
