# Shared Claude / Codex instructions

Both agents are equal contributors to this B-2 repository.
Read `docs/CURRENT_STATE.md` and the files relevant to the request before editing.
B-1 is located in `../Acnato`; never change it as part of B-2 work.

## Concurrent work

- Run git status before edits. Preserve other contributors' changes.
- For simultaneous edits of different tasks, use separate branches and git worktrees.
- Do not edit the same shared file concurrently. Coordinate file ownership in the task.
- Commit only files belonging to your task. Never reset, force-push or clean others' work.
- Update CURRENT_STATE when behavior or entry points change.

## Design and implementation

- Opening uses real 3D STL geometry. Do not substitute image scaling or crossfades.
- Camera and rotation keyframes belong in src/hero-shots.js.
- Keep lower sections and copied design tokens unless requested.
- Test loading, scroll forward/backward, resizing and reduced motion.
- Keep image fallback on WebGL/STL failure. Keep imports and model URLs repo-relative.
- No API keys or external runtime services required.
