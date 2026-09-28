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
const easeOut = t => 1 - (1 - t) ** 4;
const glide = t => t < .2 ? t * .3 : .06 + .94 * (1 - (1 - (t - .2) / .8) ** 3);
const phase = (value, start, end) => easeOut(clamp((value - start) / (end - start)));
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

function renderEyeToKnot(value) {
  const imagesMove = phase(value, 0, .34);
  const imagesSwap = phase(value, .34, .48);
  const copyHorizontal = phase(value, .48, .66);
  const copyVertical = phase(value, .66, .86);
  const copySwap = phase(value, .86, 1);
  setBox(slotA, 0, 0, mix(1208, 592, imagesMove), 640);
  setBox(slotB, 1232, 0, 592, 640);
  showBetween(layersA, 0, 1, imagesSwap);
  showBetween(layersB, 0, 1, imagesSwap);
  setBox(description, mix(0, 616, copyHorizontal), mix(664, 0, copyVertical), 592, mix(416, 640, copyVertical));
  description.style.setProperty('--copy-top', `${mix(0, 82, copyVertical)}%`);
  showBetween(copies, 0, 1, copySwap);
}

function renderKnotToLabyrinth(value) {
  const copyDown = phase(value, 0, .18);
  const imagesMove = phase(value, .18, .46);
  const imagesSwap = phase(value, .46, .60);
  const copyHorizontal = phase(value, .60, .76);
  const copyVertical = phase(value, .76, .92);
  const copySwap = phase(value, .92, 1);
  setBox(slotA, 0, 0, 592, 640);
  setBox(slotB, mix(1232, 616, imagesMove), 0, 592, 640);
  showBetween(layersA, 1, 2, imagesSwap);
  showBetween(layersB, 1, 2, imagesSwap);
  setBox(description, mix(616, 1232, copyHorizontal), mix(0, 664, copyDown) * (1 - copyVertical), 592, 640);
  description.style.setProperty('--copy-top', `${mix(82, 0, copyDown) + mix(0, 82, copyVertical)}%`);
  showBetween(copies, 1, 2, copySwap);
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
  duration = reduce.matches ? 1 : 1400 * Math.max(.35, Math.abs(target - from));
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
  if (target === 0) pose = mix(0, .08, clamp(progress / .18));
  if (target === 1 && progress >= .47) pose = mix(1, 1.08, clamp((progress - .47) / .08));
  renderPose();
}

const initialProgress = scrollProgress();
pose = target = initialProgress >= .55 ? 2 : initialProgress >= .18 ? 1 : 0;
renderPose();
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', () => { renderPose(); onScroll(); });
reduce.addEventListener('change', onScroll);
