const section = document.querySelector('.home2-symbol');
const pin = section.querySelector('.symbol-pin');
const slotA = section.querySelector('.symbol-slot-a');
const slotB = section.querySelector('.symbol-slot-b');
const description = section.querySelector('.symbol-description');
const layersA = [...slotA.children];
const layersB = [...slotB.children];
const copies = [...description.children];
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let frame = 0;
const clamp = value => Math.max(0, Math.min(1, value));
const phase = (value, start, end) => { const t = clamp((value - start) / (end - start)); return t * t; };
const mix = (a, b, t) => a + (b - a) * t;
const setBox = (node, x, y, width, height) => {
  node.style.left = `${x / 19.2}cqw`;
  node.style.top = `${y / 19.2}cqw`;
  node.style.width = `${width / 19.2}cqw`;
  node.style.height = `${height / 19.2}cqw`;
};
const showBetween = (nodes, from, to, t) => nodes.forEach((node, index) => {
  node.style.opacity = index === from ? String(1 - t) : index === to ? String(t) : '0';
});
function render() {
  frame = 0;
  const travel = Math.max(1, section.offsetHeight - pin.offsetHeight);
  const progress = reduce.matches ? 0 : clamp(-section.getBoundingClientRect().top / travel);
  if (progress <= 0.45) {
    const image = phase(progress, 0, 0.26);
    setBox(slotA, 0, 0, mix(1208, 592, image), 640);
    setBox(slotB, 1232, 0, 592, 640);
    showBetween(layersA, 0, 1, image);
    showBetween(layersB, 0, 1, image);
    const vertical = phase(progress, 0.26, 0.35);
    const horizontal = phase(progress, 0.35, 0.45);
    setBox(description, mix(0, 616, horizontal), mix(664, 0, vertical), 592, mix(416, 640, vertical));
    description.style.setProperty('--copy-top', `${mix(0, 82, phase(progress, 0.26, 0.45))}%`);
    showBetween(copies, 0, 1, phase(progress, 0.26, 0.45));
    return;
  }
  const down = phase(progress, 0.45, 0.56);
  const image = phase(progress, 0.56, 0.78);
  const horizontal = phase(progress, 0.78, 0.89);
  const vertical = phase(progress, 0.89, 1);
  setBox(slotA, 0, 0, 592, 640);
  setBox(slotB, mix(1232, 616, image), 0, 592, 640);
  showBetween(layersA, 1, 2, image);
  showBetween(layersB, 1, 2, image);
  setBox(description, mix(616, 1232, horizontal), mix(0, 664, down) * (1 - vertical), 592, mix(640, 416, vertical));
  description.style.setProperty('--copy-top', `${mix(82, 0, down) + mix(0, 82, vertical)}%`);
  showBetween(copies, 1, 2, phase(progress, 0.45, 1));
}
function wake() { if (!frame) frame = requestAnimationFrame(render); }
addEventListener('scroll', wake, { passive: true });
addEventListener('resize', wake);
reduce.addEventListener('change', wake);
render();
