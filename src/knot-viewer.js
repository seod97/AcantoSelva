import * as THREE from "three";
import { STLLoader } from "../public/vendor/three/loaders/STLLoader.js";
import { OrbitControls } from "../public/vendor/three/controls/OrbitControls.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function smoothNormals(geometry) {
  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const groups = new Map();
  const quantize = (v) => Math.round(v * 2048);

  for (let i = 0; i < position.count; i++) {
    const key = `${quantize(position.getX(i))}|${quantize(position.getY(i))}|${quantize(position.getZ(i))}`;
    let group = groups.get(key);
    if (!group) {
      group = [];
      groups.set(key, group);
    }
    group.push(i);
  }

  const out = new Float32Array(normal.count * 3);
  groups.forEach((indices) => {
    let x = 0, y = 0, z = 0;
    for (const i of indices) {
      x += normal.getX(i);
      y += normal.getY(i);
      z += normal.getZ(i);
    }
    const length = Math.hypot(x, y, z) || 1;
    for (const i of indices) {
      out[i * 3] = x / length;
      out[i * 3 + 1] = y / length;
      out[i * 3 + 2] = z / length;
    }
  });

  geometry.setAttribute("normal", new THREE.BufferAttribute(out, 3));
  geometry.attributes.normal.needsUpdate = true;
}

function buildStudioEnvironment(renderer) {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color("#15140f");

  const room = new THREE.Mesh(
    new THREE.BoxGeometry(14, 14, 14),
    new THREE.MeshBasicMaterial({ color: "#0e0d0b", side: THREE.BackSide })
  );
  envScene.add(room);

  const softbox = (w, h, color, intensity, x, y, z, rx, ry, rz) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color, toneMapped: false })
    );
    mesh.material.color.multiplyScalar(intensity);
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    envScene.add(mesh);
  };

  softbox(6, 3, "#ffffff", 3.4, 0, 5.4, 0, Math.PI / 2, 0, 0);
  softbox(4, 6, "#dce6f2", 2.2, -5.4, 0.5, 0, 0, Math.PI / 2, 0);
  softbox(4, 6, "#eef0ed", 1.7, 5.4, -0.5, 0, 0, -Math.PI / 2, 0);
  softbox(8, 3, "#e3e5e3", 0.9, 0, -5.4, 0, -Math.PI / 2, 0, 0);
  softbox(3, 3, "#ffffff", 1.2, 0, 1, -5.4, 0, 0, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const target = pmrem.fromScene(envScene, 0.035);
  pmrem.dispose();
  envScene.traverse((object) => {
    if (object.isMesh) {
      object.geometry.dispose();
      object.material.dispose();
    }
  });
  return target.texture;
}

function initKnotViewer(container) {
  const canvas = container.querySelector(".knot-viewer__canvas");
  const fallback = container.querySelector(".knot-viewer__fallback");
  const stlSrc = container.dataset.stlSrc || "./public/assets/models/knot.stl";

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (error) {
    fallback.hidden = false;
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 6);
  // Optical close-up for Symbol cards; preserve each model's existing pose.
  if (container.classList.contains("knot-viewer--reveal")) {
    camera.zoom = 2.64;
    camera.updateProjectionMatrix();
  }

  scene.environment = buildStudioEnvironment(renderer);

  const light = new THREE.PointLight("#ffffff", 22, 30, 2);
  light.position.set(2, 3, 5);
  scene.add(light);

  const rim = new THREE.PointLight("#cad7df", 8, 30, 2);
  rim.position.set(-3, 1, -2);
  scene.add(rim);

  const controls = new OrbitControls(camera, canvas);
  if (container.classList.contains("knot-viewer--reveal")) {
    // Frame the side wall and ornamental shoulder, not the empty ring opening.
    camera.position.set(1.35, 1, 5.4);
    controls.target.set(0, 1, 0);
    controls.enableRotate = false;
    controls.update();
  }
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.minPolarAngle = Math.PI / 3;
  controls.maxPolarAngle = (Math.PI * 2) / 3;
  controls.autoRotate = !reducedMotion.matches;
  controls.autoRotateSpeed = 1.4;

  let hovering = false;
  let focused = false;
  let inViewport = false;
  let draw = null;
  let running = false;
  const revealOnly = container.classList.contains("knot-viewer--reveal");
  const interactionTarget = container.closest(".symbol-card") || container;
  const syncRendering = () => {
    const next = Boolean(draw && inViewport && !document.hidden &&
      (!revealOnly || hovering || focused));
    if (next === running) return;
    running = next;
    renderer.setAnimationLoop(next ? draw : null);
  };
  interactionTarget.addEventListener("pointerenter", () => { hovering = true; syncRendering(); });
  interactionTarget.addEventListener("pointerleave", () => { hovering = false; syncRendering(); });
  interactionTarget.addEventListener("focusin", () => { focused = true; syncRendering(); });
  interactionTarget.addEventListener("focusout", (event) => {
    focused = interactionTarget.contains(event.relatedTarget);
    syncRendering();
  });
  document.addEventListener("visibilitychange", syncRendering);
  const visibilityObserver = new IntersectionObserver((entries) => {
    inViewport = entries[0].isIntersecting;
    syncRendering();
  });
  visibilityObserver.observe(container);

  function resize() {
    const { clientWidth, clientHeight } = container;
    if (!clientWidth || !clientHeight) return;
    renderer.setSize(clientWidth, clientHeight);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  new STLLoader().load(
    stlSrc,
    (geometry) => {
      geometry.computeVertexNormals();
      smoothNormals(geometry);
      geometry.computeBoundingBox();

      const size = new THREE.Vector3();
      geometry.boundingBox.getSize(size);
      const center = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);
      geometry.translate(-center.x, -center.y, -center.z);

      const scale = 2.6 / Math.max(size.x, size.y, size.z);

      const material = new THREE.MeshStandardMaterial({
        color: "#d9dbdd",
        metalness: 1,
        roughness: 0.28,
        envMapIntensity: 1.2,
      });

      const poseXDeg = Number(container.dataset.poseX);
      const baseRotationX = Number.isFinite(poseXDeg) ? (poseXDeg * Math.PI) / 180 : -Math.PI / 2.4;
      const poseYDeg = Number(container.dataset.poseY);
      const baseRotationY = Number.isFinite(poseYDeg) ? (poseYDeg * Math.PI) / 180 : 0;

      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.setScalar(scale);
      mesh.rotation.x = baseRotationX;
      mesh.rotation.y = baseRotationY;
      scene.add(mesh);

      container.classList.add("is-ready");

      draw = (time) => {
        const interacting = hovering || focused;
        controls.autoRotate = !interacting && !reducedMotion.matches;
        controls.update();

        let targetX = baseRotationX;
        let targetY = baseRotationY;
        let targetZ = 0;

        if (interacting && !reducedMotion.matches) {
          const t = time * 0.00028;
          targetY = baseRotationY + Math.sin(t * 0.75 + 0.8) * 0.16;
          targetX = baseRotationX + Math.sin(t * 0.9) * 0.3;
          targetZ = Math.sin(t * 0.6 + 1.4) * 0.22;
        }

        mesh.rotation.x += (targetX - mesh.rotation.x) * 0.05;
        mesh.rotation.y += (targetY - mesh.rotation.y) * 0.05;
        mesh.rotation.z += (targetZ - mesh.rotation.z) * 0.05;

        renderer.render(scene, camera);
      };
      syncRendering();
    },
    undefined,
    () => {
      fallback.hidden = false;
      canvas.hidden = true;
    }
  );
}

const viewerContainers = document.querySelectorAll("[data-knot-viewer]");

if (viewerContainers.length && "WebGLRenderingContext" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        initKnotViewer(entry.target);
      });
    },
    { rootMargin: "400px 0px" }
  );

  viewerContainers.forEach((container) => observer.observe(container));
} else {
  viewerContainers.forEach((container) => {
    const fallback = container.querySelector(".knot-viewer__fallback");
    if (fallback) fallback.hidden = false;
  });
}
