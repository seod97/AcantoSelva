import * as THREE from 'three';
import { STLLoader } from '../public/vendor/three/loaders/STLLoader.js';
import { SHOTS } from './hero-shots.js';

// Original markup remains a no-JavaScript fallback. B-2 owns only the opening.
const opening = document.querySelector('.index');
const hero = document.querySelector('.hero');
const track = document.createElement('section');
track.className = 'b2-track';
track.id = 'index';
track.setAttribute('aria-label', 'Guardian Knot — scroll to explore');
track.innerHTML = `<div class="b2-stage"><img class="b2-fallback" src="./public/assets/b2/HeroImage_01.png" alt="Guardian Knot 반지 정면"><canvas class="b2-canvas" aria-label="스크롤에 따라 확대하고 회전하는 Guardian Knot 3D 반지"></canvas><div class="b2-brand">Acanto Selva</div><h1 class="b2-heading">Rooted in resilience<br>Shaped by movement</h1><button class="b2-cue">Scroll to explore ↓</button><p class="b2-status" role="status">Loading object…</p></div>`;
opening.replaceWith(track);
hero.remove();
import('./app.js');
const stage = track.firstElementChild;
const status = stage.querySelector('.b2-status');
const heading = stage.querySelector('.b2-heading');
const cue = stage.querySelector('.b2-cue');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = THREE.MathUtils.clamp;
let renderer, mesh, environment;
let frame = 0, current = 0, last = 0;
let visible = true;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
function progress() {
  if (reduce.matches) return 0;
  return clamp(-track.getBoundingClientRect().top / Math.max(1, track.offsetHeight - innerHeight), 0, 1);
}
function wake() {
  if (!frame && mesh && visible && !document.hidden) frame = requestAnimationFrame(draw);
}
function draw(time) {
  frame = 0;
  const target = progress();
  const dt = Math.min((time - (last || time)) / 1000, 0.05);
  last = time;
  current += (target - current) * (1 - Math.exp(-dt * 9));
  if (Math.abs(target - current) < 0.0001) current = target;
  let b = SHOTS.findIndex(s => s.at >= current);
  if (b < 1) b = 1;
  const a = SHOTS[b - 1], end = SHOTS[b];
  let t = clamp((current - a.at) / (end.at - a.at), 0, 1);
  t = t * t * (3 - 2 * t);
  camera.position.set(THREE.MathUtils.lerp(a.x, end.x, t), 0, THREE.MathUtils.lerp(a.distance, end.distance, t));
  camera.lookAt(THREE.MathUtils.lerp(a.targetX, end.targetX, t), 0, 0);
  mesh.rotation.y = THREE.MathUtils.lerp(a.rotation, end.rotation, t);
  heading.style.opacity = String(clamp(1 - Math.abs(current - 0.43) / 0.14, 0, 1));
  cue.style.opacity = String(clamp(1 - current * 12, 0, 1));
  cue.disabled = current > 0.1;
  renderer.render(scene, camera);
  if (current !== target) wake();
}
cue.addEventListener('click', () => {
  const top = scrollY + track.getBoundingClientRect().top;
  scrollTo({ top: reduce.matches ? top + innerHeight : top + (track.offsetHeight - innerHeight) * 0.43, behavior: reduce.matches ? 'instant' : 'smooth' });
});
try {
  renderer = new THREE.WebGLRenderer({ canvas: stage.querySelector('canvas'), antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const studio = new THREE.Scene();
  studio.background = new THREE.Color('#252421');
  for (const [x, y, z, w, h, power] of [[-4, 1, 3, 2, 8, 5], [4, 0, 2, 1, 7, 4], [0, 5, 0, 6, 2, 3], [0, 1, 6, 8, 8, 1.4]]) {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color('white').multiplyScalar(power), side: THREE.DoubleSide }));
    panel.position.set(x, y, z); panel.lookAt(0, 0, 0); studio.add(panel);
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  environment = pmrem.fromScene(studio, 0.05);
  scene.environment = environment.texture;
  pmrem.dispose();
  studio.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
  const resize = () => { renderer.setSize(stage.clientWidth, stage.clientHeight); camera.aspect = stage.clientWidth / stage.clientHeight; camera.updateProjectionMatrix(); wake(); };
  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; wake(); }).observe(track);
  addEventListener('scroll', wake, { passive: true });
  document.addEventListener('visibilitychange', wake);
  reduce.addEventListener('change', () => { current = progress(); wake(); });
  new STLLoader().load('./public/assets/models/knot.stl', geometry => {
    // STL triangles duplicate vertices; average shared normals for polished metal.
    const p = geometry.attributes.position, n = geometry.attributes.normal;
    const sums = new Map(), keys = [];
    for (let i = 0; i < p.count; i++) {
      const key = [p.getX(i), p.getY(i), p.getZ(i)].map(v => Math.round(v * 2048)).join(',');
      keys.push(key);
      if (!sums.has(key)) sums.set(key, new THREE.Vector3());
      sums.get(key).add(new THREE.Vector3(n.getX(i), n.getY(i), n.getZ(i)));
    }
    sums.forEach(v => v.normalize());
    keys.forEach((key, i) => { const v = sums.get(key); n.setXYZ(i, v.x, v.y, v.z); });
    n.needsUpdate = true;
    geometry.center(); geometry.computeBoundingBox();
    const size = geometry.boundingBox.getSize(new THREE.Vector3());
    // Ring axis is its thinnest bounding-box dimension. Orient opening toward camera.
    const axis = [size.x, size.y, size.z].indexOf(Math.min(size.x, size.y, size.z));
    if (axis === 0) geometry.rotateY(Math.PI / 2);
    if (axis === 1) geometry.rotateX(Math.PI / 2);
    geometry.scale(...Array(3).fill(2 / Math.max(size.x, size.y, size.z)));
    mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: '#77736b', metalness: 1, roughness: 0.22, envMapIntensity: 1 }));
    scene.add(mesh); stage.classList.add('is-ready'); status.hidden = true; resize(); wake();
  }, undefined, () => { status.textContent = '3D 모델을 불러오지 못했습니다. 새로고침해 주세요.'; });
} catch (error) {
  status.textContent = '이 브라우저에서는 3D를 표시할 수 없어 제품 이미지를 표시합니다.';
  console.warn('B-2 WebGL unavailable', error);
}
