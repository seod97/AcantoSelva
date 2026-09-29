// A single GSAP ticker drives scrolling, scene timelines and 3D redraws.
export const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(500, 33);
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
export const scenes = new Map();
export const clamp = gsap.utils.clamp(0, 1);
export function registerScene(element, scene) { scenes.set(element, scene); }
export function tween(target, vars) {
  return new Promise(resolve => {
    let settled = false;
    const done = () => { if (settled) return; settled = true; resolve(); };
    const ms = (typeof vars.duration === 'number' ? vars.duration : .5) * 1000;
    // Rare, unreproduced GSAP issue: a tween can stop ticking entirely (no
    // onUpdate/onComplete ever again), which used to hang change() forever
    // since nothing else re-fires this promise. A same-target tween triggers
    // GSAP's default auto-overwrite on whatever's stuck, which was already
    // confirmed to unstick it manually — do that automatically as a fallback.
    const watchdog = setTimeout(() => gsap.to(target, { ...vars, duration: 0, onComplete: done }), ms + 600);
    gsap.to(target, { ...vars, onComplete: () => { clearTimeout(watchdog); done(); },
      onInterrupt: () => { clearTimeout(watchdog); done(); } });
  });
}
