// A calm "settle into place" reveal for photo/placeholder groups within a
// section, replayed every time the section is re-entered (not just once per
// page load) — registerScene's sync fires on every activation, forward or
// backward, so re-arming there is what makes "leave and come back" replay it.
import { gsap, ScrollTrigger, reducedMotion, registerScene } from './motion-runtime.js?v=38';

function resolveEls(selectors) {
  return typeof selectors === 'string'
    ? [...document.querySelectorAll(selectors)]
    : selectors.map(s => document.querySelector(s)).filter(Boolean);
}

function setupSectionReveal(section, groups) {
  if (!section) return;
  let triggers = [];
  function arm() {
    triggers.forEach(t => t && t.kill());
    triggers = groups.map(({ container, selectors }) => {
      const els = resolveEls(selectors);
      if (!els.length || !container) return null;
      if (reducedMotion.matches) { gsap.set(els, { opacity: 1, y: 0 }); return null; }
      gsap.set(els, { opacity: 0, y: -36 });
      const reveal = () => gsap.to(els, { opacity: 1, y: 0, duration: .9, ease: 'power2.out', stagger: .12 });
      // A backward re-entry can land past this group's trigger point
      // already (place() jumps straight to the section's bound.end) —
      // ScrollTrigger only fires onEnter on a live crossing, not for a
      // point that was already past the instant it was created, so check
      // the already-past case here and play immediately instead of
      // silently leaving it invisible.
      if (container.getBoundingClientRect().top < innerHeight * .85) { reveal(); return null; }
      return ScrollTrigger.create({ trigger: container, start: 'top 85%', once: true, onEnter: reveal });
    });
  }
  arm();
  registerScene(section, { sync: arm });
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    triggers.forEach(t => t && t.kill());
    groups.forEach(({ selectors }) => gsap.set(resolveEls(selectors), { opacity: 1, y: 0 }));
  });
}

export function initScrollReveal() {
  // The hero shot at the top of Object is intentionally excluded — it's the
  // section's lead image, not part of this reveal.
  setupSectionReveal(document.querySelector('#objects'), [
    { container: document.querySelector('.object-guardian'), selectors: ['.object-guardian-knot', '.object-guardian-eye', '.object-guardian-labyrinth'] },
    { container: document.querySelector('.object-bold'), selectors: ['.object-bold-a', '.object-bold-b', '.object-bold-c'] },
  ]);

  setupSectionReveal(document.querySelector('#origin'), [
    { container: document.querySelector('.origin-pair'), selectors: '.origin-item-media' },
    { container: document.querySelector('.origin-synthesis-small'), selectors: ['.origin-synthesis-small-media'] },
    { container: document.querySelector('.origin-synthesis-02'), selectors: ['.origin-synthesis-02-media'] },
  ]);
}
