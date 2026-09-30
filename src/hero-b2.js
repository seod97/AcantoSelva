import * as THREE from 'three';
import { GLTFLoader } from '../public/vendor/three/loaders/GLTFLoader.js';
import { SHOTS } from './hero-shots.js?v=42';
import { gsap, ScrollTrigger, reducedMotion, registerScene } from './motion-runtime.js?v=42';

export async function initHero() {
  const track = document.querySelector('#hero-banner');
  const stage = track.firstElementChild;
  const canvas = stage.querySelector('canvas');
  const status = stage.querySelector('.b2-status');
  const heading = stage.querySelector('.b2-heading');
  const pose = { distance: SHOTS[0].distance, rotation: 0, text: 0, wipe: 0 };
  let renderer, mesh, environment, dirty = true, ready = false;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .01, 100);

  function applyPose() {
    camera.position.set(0, 0, pose.distance);
    camera.lookAt(0, 0, 0);
    if (mesh) mesh.rotation.y = pose.rotation;
    heading.style.opacity = String(pose.text);
    heading.style.visibility = pose.wipe >= 99.9 || pose.text < .001 ? 'hidden' : 'visible';
    heading.style.clipPath = `inset(0 0 0 ${pose.wipe}%)`;
    dirty = true;
  }
  const timeline = gsap.timeline({ paused: true, onUpdate: applyPose });
  SHOTS.slice(1).forEach((shot, i) => timeline.to(pose, {
    distance: shot.distance, rotation: shot.rotation,
    duration: shot.at - SHOTS[i].at, ease: 'sine.inOut'
  }, SHOTS[i].at));
  timeline.to(pose, { text: 1, duration: .11, ease: 'sine.inOut' }, .34)
    .to(pose, { wipe: 100, duration: .14, ease: 'sine.inOut' }, .76)
    .to(pose, { text: 0, duration: .035, ease: 'none' }, .875);
  const trigger = ScrollTrigger.create({
    trigger: track, start: 'top top',
    end: () => `+=${Math.max(1, track.offsetHeight - stage.offsetHeight)}`,
    onUpdate: self => {
      timeline.progress(reducedMotion.matches ? .54 : self.progress);
      applyPose();
    }
  });
  function draw() {
    if (!ready || !dirty || document.hidden || !track.classList.contains('is-current')) return;
    renderer.render(scene, camera);
    dirty = false;
  }
  function sync() {
    timeline.progress(reducedMotion.matches ? .54 : trigger.progress);
    applyPose();
    draw();
  }
  const fallback = error => {
    stage.classList.add('is-fallback');
    canvas.style.visibility = 'hidden';
    status.hidden = true;
    console.warn('Hero uses its product-image fallback:', error);
  };

  try {
    // Start fetching while WebGL and the studio environment are prepared.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const modelBytes = fetch('./public/assets/models/knot-web.glb', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error(`Model HTTP ${response.status}`); return response.arrayBuffer(); })
      .finally(() => clearTimeout(timeout));
    modelBytes.catch(() => {});
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const studio = new THREE.Scene();
    studio.background = new THREE.Color('#252421');
    for (const [x, y, z, w, h, power] of [[-4, 1, 3, 2, 8, 5], [4, 0, 2, 1, 7, 4], [0, 5, 0, 6, 2, 3], [0, 1, 6, 8, 8, 1.4]]) {
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({
        color: new THREE.Color('white').multiplyScalar(power), side: THREE.DoubleSide
      }));
      panel.position.set(x, y, z); panel.lookAt(0, 0, 0); studio.add(panel);
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    environment = pmrem.fromScene(studio, .04);
    scene.environment = environment.texture;
    pmrem.dispose();
    studio.traverse(object => { if (object.isMesh) { object.geometry.dispose(); object.material.dispose(); } });
    const gltf = await new GLTFLoader().parseAsync(await modelBytes, '');
    gltf.scene.traverse(object => { if (object.isMesh) mesh = object; });
    if (!mesh) throw new Error('The prepared ring has no geometry');
    mesh.material.dispose();
    mesh.material = new THREE.MeshStandardMaterial({ color: '#77736b', metalness: 1, roughness: .22, envMapIntensity: 1 });
    scene.add(mesh);
    const resize = () => {
      renderer.setSize(stage.clientWidth, stage.clientHeight, false);
      camera.aspect = stage.clientWidth / stage.clientHeight;
      camera.updateProjectionMatrix();
      dirty = true;
    };
    resize(); sync();
    // Warm the shader and draw the exact current pose before revealing the canvas.
    await renderer.compileAsync(scene, camera);
    renderer.render(scene, camera);
    ready = true;
    stage.classList.add('is-ready');
    status.hidden = true;
    new ResizeObserver(resize).observe(stage);
    gsap.ticker.add(draw);
    registerScene(track, { sync });
    reducedMotion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', () => { dirty = true; });
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); ready = false; fallback('WebGL context lost'); });
    canvas.addEventListener('webglcontextrestored', () => {
      ready = true; stage.classList.remove('is-fallback'); canvas.style.visibility = ''; sync();
    });
  } catch (error) {
    renderer?.dispose();
    environment?.dispose();
    fallback(error);
  }
}
