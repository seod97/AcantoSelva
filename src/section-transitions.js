import { gsap, ScrollTrigger, reducedMotion, scenes, tween } from './motion-runtime.js?v=42';

export function initSections() {
  history.scrollRestoration = 'manual';
  ScrollTrigger.clearScrollMemory('manual');
  const main = document.querySelector('main');
  const sections = [...main.querySelectorAll(':scope > section')];
  const footer = main.querySelector(':scope > footer');
  const last = sections.length - 1;
  const veil = document.createElement('div');
  veil.className = 'section-transition-veil';
  veil.setAttribute('aria-hidden', 'true');
  document.body.appendChild(veil);
  let bounds = [], active = 0, busy = false, cooldown = 0;
  let guard = 0, guardDirection = 0, edgeSince = 0;
  const position = { y: scrollY };
  let targetY = scrollY;

  // A single continuous follow-loop, not a fresh tween per input event.
  // Trackpad/Magic Mouse fire many small deltas per second; restarting a
  // tween on every one of them never gave any single tween enough time to
  // actually move before being killed and restarted, so scroll barely
  // advanced. This just eases position.y toward whatever targetY currently
  // is, every frame, so bursts of tiny deltas and single big wheel notches
  // both feel the same (smooth, no restart jitter).
  function followTick() {
    const dy = targetY - position.y;
    if (Math.abs(dy) < 0.4) { if (dy) position.y = targetY; return; }
    position.y += dy * 0.22;
    scrollTo({ top: position.y, behavior: 'instant' });
    ScrollTrigger.update();
  }
  gsap.ticker.add(followTick);

  function measure() {
    bounds = sections.map(section => {
      const start = section.getBoundingClientRect().top + scrollY;
      // Sections with their own sticky-pinned child (Hero, Symbol) run an
      // internal ScrollTrigger sized off THAT element's height, not the
      // viewport's — end: () => `+=${section.offsetHeight - pin.offsetHeight}`.
      // Using innerHeight here instead let this system decide "we've hit the
      // edge" at a different scroll position than the internal one expected,
      // so on some viewport sizes the section handed off to the next one
      // before its own internal progress ever reached 1 (Symbol's Labyrinth
      // state was unreachable — scroll got capped short of the 94% mark
      // needed to trigger it). Matching the same element here keeps both
      // systems agreeing on exactly where the section ends.
      const pinned = [...section.children].find(el => getComputedStyle(el).position === 'sticky');
      const reserve = pinned ? pinned.offsetHeight : innerHeight;
      return { start, end: Math.max(start, start + section.offsetHeight - reserve) };
    });
    bounds[last].end = Math.max(bounds[last].start, document.documentElement.scrollHeight - innerHeight);
  }
  function indexAt(y) {
    let index = 0;
    bounds.forEach((bound, i) => { if (y >= bound.start - 2) index = i; });
    return index;
  }
  function select(index) {
    active = index;
    for (const [i, section] of sections.entries()) {
      const current = i === index;
      section.classList.toggle('is-current', current);
      section.inert = !current;
      section.setAttribute('aria-hidden', String(!current));
    }
    footer.classList.toggle('is-current', index === last);
    footer.inert = index !== last;
    footer.setAttribute('aria-hidden', String(index !== last));
    main.dataset.activeSection = sections[index].id || sections[index].classList[0];
  }
  function place(y) {
    targetY = position.y = y;
    scrollTo({ top: y, behavior: 'instant' });
    ScrollTrigger.update();
  }
  function move(y) {
    targetY = y;
    if (reducedMotion.matches) place(y);
    // Otherwise followTick() carries position.y to targetY every frame.
  }
  function resetGuard() { guard = 0; guardDirection = 0; edgeSince = 0; }

  async function change(index, direction, destination) {
    if (busy || index < 0 || index > last || index === active) return;
    busy = true;
    main.dataset.transitioning = 'true';
    veil.classList.add('is-active');
    try {
      await tween(veil, { opacity: 1, duration: reducedMotion.matches ? 0 : .5, ease: 'sine.inOut' });
      // Only swap visible scenes under the fully opaque cover. Capped: the
      // Hero 3D model (fetch + shader compile) can take several real
      // seconds, and awaiting it unconditionally froze ALL site scrolling
      // for that whole time — reveal on schedule instead and let Hero's own
      // fallback-image/is-ready swap happen whenever the model actually
      // finishes, independent of this transition.
      const scene = scenes.get(sections[index]);
      if (scene?.ready) {
        await Promise.race([scene.ready, new Promise(resolve => setTimeout(resolve, 1200))]);
      }
      measure();
      select(index);
      const bound = bounds[index];
      const y = destination ?? (direction > 0 ? bound.start : bound.end);
      place(gsap.utils.clamp(bound.start, bound.end, y));
      scenes.get(sections[index])?.sync?.();
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await tween(veil, { opacity: 0, duration: reducedMotion.matches ? 0 : .7, ease: 'sine.inOut' });
    } finally {
      gsap.set(veil, { opacity: 0 });
      veil.classList.remove('is-active');
      resetGuard();
      cooldown = performance.now() + 220;
      busy = false;
      delete main.dataset.transitioning;
    }
  }

  function input(event, delta) {
    if (!delta) return;
    event.preventDefault();
    if (busy || performance.now() < cooldown) return;
    const direction = Math.sign(delta), bound = bounds[active];
    const edge = direction > 0 ? bound.end : bound.start;
    const nextY = gsap.utils.clamp(bound.start, bound.end, targetY + delta);
    if (Math.abs(targetY - edge) > 1 || Math.abs(scrollY - edge) > 2) {
      resetGuard();
      move(nextY);
      return;
    }
    if ((active === 0 && direction < 0) || (active === last && direction > 0)) return;
    if (guardDirection !== direction) { resetGuard(); guardDirection = direction; }
    if (!edgeSince) edgeSince = performance.now();
    // Finish the current Symbol pose before exposing the next scene.
    if (scenes.get(sections[active])?.isMoving?.()) return;
    guard += Math.min(Math.abs(delta), 200);
    if (guard >= 150 && performance.now() - edgeSince >= 90) void change(active + direction, direction);
  }

  measure();
  const initialAnchor = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  const anchorIndex = sections.findIndex(section => section === initialAnchor || section.contains(initialAnchor));
  select(anchorIndex >= 0 ? anchorIndex : indexAt(scrollY));
  main.classList.add('motion-isolated');
  document.documentElement.classList.add('motion-enabled');
  place(anchorIndex >= 0 ? bounds[active].start : gsap.utils.clamp(bounds[active].start, bounds[active].end, scrollY));
  scenes.get(sections[active])?.sync?.();

  addEventListener('wheel', event => {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    input(event, event.deltaY * unit);
  }, { passive: false });
  addEventListener('keydown', event => {
    if (event.target.closest('input,textarea,select,button,a,[contenteditable]') || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : last;
      if (!busy && active === index) move(event.key === 'Home' ? bounds[0].start : bounds[last].end);
      else void change(index, index > active ? 1 : -1, event.key === 'Home' ? bounds[0].start : bounds[last].end);
      return;
    }
    const delta = { ArrowDown: 80, ArrowUp: -80, PageDown: innerHeight * .8,
      PageUp: -innerHeight * .8, ' ': innerHeight * (event.shiftKey ? -.8 : .8) }[event.key];
    if (delta) input(event, delta);
  });
  let touchY;
  addEventListener('touchstart', event => { touchY = event.touches.length === 1 ? event.touches[0].clientY : undefined; }, { passive: true });
  addEventListener('touchmove', event => {
    if (touchY === undefined || event.touches.length !== 1) return;
    const y = event.touches[0].clientY;
    input(event, touchY - y);
    touchY = y;
  }, { passive: false });

  // Scrollbar drags, browser Find, anchors and history can bypass wheel handling.
  // Inactive sections remain hidden even before this event is processed.
  addEventListener('scroll', () => {
    if (busy) return;
    const bound = bounds[active], y = scrollY;
    if (y >= bound.start - 2 && y <= bound.end + 2) {
      // Only resync from an externally-caused scroll (scrollbar drag,
      // browser Find, back/forward) — our own followTick()/place() calls
      // already keep position.y === scrollY, so this is a no-op for them.
      if (Math.abs(y - position.y) > 3) targetY = position.y = y;
      return;
    }
    const direction = y > bound.end ? 1 : -1;
    const requested = indexAt(y);
    const next = requested === active ? active + direction : requested;
    place(direction > 0 ? bound.end : bound.start);
    void change(next, direction);
  }, { passive: true });
  addEventListener('hashchange', () => {
    const node = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const index = sections.findIndex(section => section === node || section.contains(node));
    if (index >= 0) void change(index, index >= active ? 1 : -1, bounds[index].start);
  });
  ScrollTrigger.addEventListener('refresh', () => {
    measure();
    if (busy) return;
    // Late font/image loads shift layout by a few px; only snap scroll back
    // in bounds if it's actually invalid now, so an in-progress scroll never
    // gets yanked for a sub-pixel remeasure (was causing a visible "jump back
    // up" right as the user started scrolling, while fonts were still loading).
    const bound = bounds[active];
    if (scrollY < bound.start - 2 || scrollY > bound.end + 2) {
      place(gsap.utils.clamp(bound.start, bound.end, scrollY));
    }
  });
}
