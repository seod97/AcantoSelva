import { gsap, ScrollTrigger, reducedMotion, registerScene } from './motion-runtime.js?v=41';

export function initSymbol() {
  const section = document.querySelector('#symbol');
  const pin = section.querySelector('.symbol-pin');
  const slotA = section.querySelector('.symbol-slot-a');
  const slotB = section.querySelector('.symbol-slot-b');
  const description = section.querySelector('.symbol-description');
  const layersA = [...slotA.children], layersB = [...slotB.children];
  const copies = [...description.children];
  const state = { crop: 0, bx: 1232, dx: 0, dy: 664, eye: 1, knot: 0, labyrinth: 0,
    eyeCopy: 1, knotCopy: 0, labyrinthCopy: 0 };
  let scale = document.querySelector('main').clientWidth / 1920;
  let target = 0, playback, preview;
  const labels = [0, 3.2, 6.6];

  function render() {
    // Fixed-size image layers + crop avoid reflow or stretching the photographs.
    slotA.style.clipPath = `inset(0 ${state.crop}% 0 0)`;
    slotB.style.transform = `translate3d(${state.bx * scale}px,0,0)`;
    description.style.transform = `translate3d(${state.dx * scale}px,${state.dy * scale}px,0)`;
    ['eye', 'knot', 'labyrinth'].forEach((key, i) => {
      layersA[i].style.opacity = layersB[i].style.opacity = state[key];
      copies[i].style.opacity = state[`${key}Copy`];
    });
  }
  const timeline = gsap.timeline({ paused: true, onUpdate: render, defaults: { ease: 'power2.inOut' } });
  timeline
    .to(state, { eyeCopy: 0, duration: .35 }, 0)
    .to(state, { crop: (1208 - 592) / 1208 * 100, duration: 1.05 }, .35)
    .to(state, { eye: 0, knot: 1, duration: .55, ease: 'sine.inOut' }, 1.65)
    // Eye description moves horizontally first, then vertically, while hidden.
    .to(state, { dx: 616, duration: .4 }, 1.6)
    .to(state, { dy: 0, duration: .45 }, 2)
    .to(state, { knotCopy: 1, duration: .65, ease: 'sine.inOut' }, 2.55)
    .addLabel('knot', 3.2)
    .to(state, { knotCopy: 0, duration: .35 }, 3.2)
    .to(state, { dy: 664, duration: .4 }, 3.55)
    .to(state, { bx: 616, duration: 1.05 }, 3.95)
    .to(state, { knot: 0, labyrinth: 1, duration: .55, ease: 'sine.inOut' }, 5.2)
    .to(state, { dx: 1232, duration: .35 }, 5.15)
    .to(state, { dy: 0, duration: .4 }, 5.5)
    .to(state, { labyrinthCopy: 1, duration: .65, ease: 'sine.inOut' }, 5.95)
    .addLabel('labyrinth', 6.6);

  function desired(progress) {
    if (target === 0) return progress >= .18 ? 1 : 0;
    // Labyrinth used to lock in at .57, leaving dead scroll after it locks
    // (nothing reacts once locked, but the section still had scroll left).
    // Pushed to .94 so almost none of the range is dead.
    if (target === 1) return progress < .10 ? 0 : progress >= .94 ? 2 : 1;
    return progress < .85 ? 1 : 2;
  }
  function go(next) {
    playback?.kill(); preview?.kill();
    playback = preview = null;
    target = next;
    if (reducedMotion.matches) { timeline.time(labels[next]); render(); return; }
    // One reversible playhead, including reversal in the middle of a transition.
    // Capped so the tail state-settle (e.g. knot -> labyrinth, 3.4 timeline
    // units apart) never locks out the next-section scroll gate for more
    // than ~1.1s of real time — it was blocking transitions for a literal
    // 3.4s before, reading as "scrolling does nothing."
    playback = timeline.tweenTo(labels[next], {
      duration: Math.min(1.1, Math.max(.3, Math.abs(labels[next] - timeline.time()))),
      ease: 'none', onComplete: () => { playback = null; update(trigger.progress); }
    });
  }
  function update(progress) {
    if (!section.classList.contains('is-current')) return;
    const next = desired(progress);
    if (next !== target) { go(next); return; }
    // isActive() is false before the first tick; do not overwrite a scheduled tween.
    if (playback && playback.progress() < 1) return;
    // A subtle response before committing; never leave all copy invisible here.
    const amount = target === 0 ? Math.min(progress / .18, 1)
      : target === 1 ? gsap.utils.clamp(0, 1, (progress - .35) / .22) : 0;
    const time = labels[target] + (target < 2 ? .10 * amount : 0);
    preview?.kill();
    preview = gsap.to(timeline, { time, duration: reducedMotion.matches ? 0 : .18,
      ease: 'power1.out', overwrite: true });
  }
  const trigger = ScrollTrigger.create({
    trigger: section, start: 'top top',
    end: () => `+=${Math.max(1, section.offsetHeight - pin.offsetHeight)}`,
    onUpdate: self => update(self.progress)
  });
  function sync() {
    playback?.kill(); preview?.kill();
    playback = preview = null;
    const p = trigger.progress;
    target = p >= .94 ? 2 : p >= .18 ? 1 : 0;
    timeline.time(labels[target]);
    render();
  }
  new ResizeObserver(() => { scale = document.querySelector('main').clientWidth / 1920; render(); }).observe(pin);
  reducedMotion.addEventListener('change', sync);
  registerScene(section, { sync, isMoving: () => !!playback && playback.progress() < 1 });
  render();
  return { timeline, trigger };
}
