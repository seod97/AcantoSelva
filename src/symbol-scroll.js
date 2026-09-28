const section = document.querySelector('.home2-symbol');
const pin = section.querySelector('.symbol-pin');
const slotA = section.querySelector('.symbol-slot-a');
const slotB = section.querySelector('.symbol-slot-b');
const description = section.querySelector('.symbol-description');
const layersA = [...slotA.children];
const layersB = [...slotB.children];
const copies = [...description.children];
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = value => Math.max(0, Math.min(1, value));
const mix = (a, b, t) => a + (b - a) * t;
const glide = t => t < .2 ? t * .3 : .06 + .94 * (1 - (1 - (t - .2) / .8) ** 3);
const phase = (value, start, end) => clamp((value - start) / (end - start));
let frame = 0;
let pose = 0;
let target = 0;
let from = 0;
let startedAt = 0;
let duration = 0;

function setBox(node, x, y, width, height) {
  node.style.left = `${x / 19.2}cqw`;
  node.style.top = `${y / 19.2}cqw`;
  node.style.width = `${width / 19.2}cqw`;
  node.style.height = `${height / 19.2}cqw`;
}

function showBetween(nodes, fromIndex, toIndex, amount) {
  nodes.forEach((node, index) => {
    node.style.opacity = index === fromIndex ? String(1 - amount) : index === toIndex ? String(amount) : '0';
  });
}

function showCopies(fromIndex, toIndex, value, fadeOutEnd, fadeInStart) {
  const fadeOut = phase(value, 0, fadeOutEnd);
  const fadeIn = phase(value, fadeInStart, 1);
  copies.forEach((copy, index) => {
    copy.style.opacity = index === fromIndex ? String(1 - fadeOut) : index === toIndex ? String(fadeIn) : '0';
  });
}

function renderEyeToKnot(value) {
  const imagesMove = phase(value, .12, .36);
  const imagesSwap = phase(value, .45, .63);
  const copyHorizontal = phase(value, .64, .74);
  const copyVertical = phase(value, .74, .86);
  setBox(slotA, 0, 0, mix(1208, 592, imagesMove), 640);
  setBox(slotB, 1232, 0, 592, 640);
  showBetween(layersA, 0, 1, imagesSwap);
  showBetween(layersB, 0, 1, imagesSwap);
  setBox(description, mix(0, 616, copyHorizontal), mix(664, 0, copyVertical), 592, mix(416, 640, copyVertical));
  description.style.setProperty('--copy-align', copyVertical < .5 ? 'flex-start' : 'flex-end');
  showCopies(0, 1, value, .10, .87);
}

function renderKnotToLabyrinth(value) {
  const copyDown = phase(value, .10, .20);
  const imagesMove = phase(value, .20, .42);
  const imagesSwap = phase(value, .51, .69);
  const copyHorizontal = phase(value, .70, .80);
  const copyVertical = phase(value, .80, .88);
  setBox(slotA, 0, 0, 592, 640);
  setBox(slotB, mix(1232, 616, imagesMove), 0, 592, 640);
  showBetween(layersA, 1, 2, imagesSwap);
  showBetween(layersB, 1, 2, imagesSwap);
  setBox(description, mix(616, 1232, copyHorizontal), mix(0, 664, copyDown) * (1 - copyVertical), 592, 640);
  description.style.setProperty('--copy-align', 'flex-end');
  showCopies(1, 2, value, .09, .89);
}

function renderPose() {
  if (pose <= 1) renderEyeToKnot(pose);
  else renderKnotToLabyrinth(pose - 1);
}

function scrollProgress() {
  const travel = Math.max(1, section.offsetHeight - pin.offsetHeight);
  return clamp(-section.getBoundingClientRect().top / travel);
}

function nextState(progress) {
  if (target === 0) return progress >= .18 ? 1 : 0;
  if (target === 1) return progress < .10 ? 0 : progress >= .55 ? 2 : 1;
  return progress < .47 ? 1 : 2;
}

function animateTo(next) {
  if (next === target) return;
  from = pose;
  target = next;
  startedAt = performance.now();
  duration = reduce.matches ? 1 : 3400 * Math.max(.35, Math.abs(target - from));
  wake();
}

function tick(time) {
  frame = 0;
  const elapsed = clamp((time - startedAt) / duration);
  pose = mix(from, target, glide(elapsed));
  renderPose();
  if (elapsed < 1) wake();
  else animateTo(nextState(scrollProgress()));
}

function wake() {
  if (!frame) frame = requestAnimationFrame(tick);
}

function onScroll() {
  const progress = scrollProgress();
  const next = nextState(progress);
  if (next !== target) {
    animateTo(next);
    return;
  }
  if (frame) return;
  if (target === 0) {
    pose = progress <= .08
      ? mix(0, .10, clamp(progress / .08))
      : mix(.10, .16, clamp((progress - .08) / .10));
  }
  if (target === 1 && progress >= .35) {
    pose = progress <= .43
      ? mix(1, 1.10, clamp((progress - .35) / .08))
      : mix(1.10, 1.16, clamp((progress - .43) / .12));
  }
  renderPose();
}

const initialProgress = scrollProgress();
pose = target = initialProgress >= .55 ? 2 : initialProgress >= .18 ? 1 : 0;
renderPose();
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', () => { renderPose(); onScroll(); });
reduce.addEventListener('change', onScroll);
