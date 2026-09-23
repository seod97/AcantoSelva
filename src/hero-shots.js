// Scroll positions 0–1. Camera physically moves; model rotates in 3D.
// Ring normalized to diameter 2. Modify these shots to tune the art direction.
export const SHOTS = [
  { at: 0, distance: 7.5, rotation: 0, x: 0, targetX: 0 },
  { at: 0.43, distance: 2.4, rotation: 0, x: 0, targetX: 0 },
  { at: 0.82, distance: 1.65, rotation: Math.PI / 2, x: 0, targetX: 0 },
  { at: 1, distance: 1.5, rotation: Math.PI / 2 + 0.12, x: 0.06, targetX: 0 },
];
