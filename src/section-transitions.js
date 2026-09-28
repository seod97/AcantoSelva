const sectionIds = ['index', 'hero-banner', null, 'objects', 'origin', 'symbol', null, 'standard', null];
const sections = sectionIds.map((id, index) => id ? document.getElementById(id) : document.querySelectorAll('main > section')[index]).filter(Boolean);
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const veil = document.createElement('div');
veil.className = 'section-transition-veil';
veil.setAttribute('aria-hidden', 'true');
const strips = Array.from({ length: 20 }, (_, index) => {
  const strip = document.createElement('i');
  strip.className = 'section-transition-strip';
  strip.style.top = `${index * 5}%`;
  veil.appendChild(strip);
  return strip;
});
document.body.appendChild(veil);

const GUARD_STEPS = 3;
let guardSteps = 0;
let guardKey = '';
let busy = false;
let gestureTimer = 0;

function pageTop(node) {
  return node.getBoundingClientRect().top + scrollY;
}

function animate(node, keyframes, options) {
  if (reduce.matches) return Promise.resolve();
  return node.animate(keyframes, options).finished.catch(() => {});
}

async function cover(useStrips) {
  veil.classList.add('is-active');
  veil.style.opacity = '1';
  if (!useStrips) {
    veil.style.background = '#fcfcfc';
    strips.forEach(strip => { strip.style.display = 'none'; });
    await animate(veil, [{ opacity: 0 }, { opacity: 1 }], { duration: 680, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
    return;
  }
  veil.style.background = 'transparent';
  strips.forEach(strip => {
    strip.style.display = 'block';
    strip.style.transform = 'scaleX(0)';
  });
  await Promise.all(strips.map((strip, index) => animate(strip,
    [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
    { duration: 620, delay: (strips.length - index - 1) * 18, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' }
  )));
  veil.style.background = '#fcfcfc';
}

async function reveal() {
  strips.forEach(strip => { strip.style.display = 'none'; });
  veil.style.background = '#fcfcfc';
  await animate(veil, [{ opacity: 1 }, { opacity: 0 }], { duration: 760, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
  veil.classList.remove('is-active');
  veil.style.opacity = '0';
}

async function transition(fromIndex, direction) {
  const toIndex = fromIndex + direction;
  const target = sections[toIndex];
  if (!target || busy) return;
  busy = true;
  const previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  await cover(direction > 0 && sections[fromIndex].id === 'hero-banner');
  const destination = direction > 0
    ? pageTop(target)
    : Math.max(0, pageTop(target) + target.offsetHeight - innerHeight);
  scrollTo({ top: destination, behavior: 'auto' });
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  await reveal();
  document.documentElement.style.overflow = previousOverflow;
  guardSteps = 0;
  guardKey = '';
  clearTimeout(gestureTimer);
  busy = false;
}

function boundaryFor(direction, delta) {
  const y = scrollY;
  if (direction > 0) {
    for (let index = 0; index < sections.length - 1; index++) {
      const section = sections[index];
      const end = Math.max(pageTop(section), pageTop(section) + section.offsetHeight - innerHeight);
      if (y < end - 2 && y + delta >= end) {
        scrollTo({ top: end, behavior: 'auto' });
        return { index, reached: false };
      }
      if (Math.abs(y - end) <= 3) return { index, reached: true };
    }
  } else {
    for (let index = 1; index < sections.length; index++) {
      const start = pageTop(sections[index]);
      if (y > start + 2 && y + delta <= start) {
        scrollTo({ top: start, behavior: 'auto' });
        return { index, reached: false };
      }
      if (Math.abs(y - start) <= 3) return { index, reached: true };
    }
  }
  return null;
}

addEventListener('wheel', event => {
  if (busy || Math.abs(event.deltaY) < 2 || event.ctrlKey) return;
  const direction = Math.sign(event.deltaY);
  const boundary = boundaryFor(direction, event.deltaY);
  if (!boundary) return;
  event.preventDefault();
  if (!boundary.reached) {
    guardSteps = 0;
    guardKey = '';
    clearTimeout(gestureTimer);
    return;
  }
  const key = `${boundary.index}:${direction}`;
  if (key !== guardKey) guardSteps = 0;
  guardKey = key;
  clearTimeout(gestureTimer);
  gestureTimer = setTimeout(() => {
    guardSteps += 1;
    if (guardSteps >= GUARD_STEPS) transition(boundary.index, direction);
  }, 140);
}, { passive: false });
