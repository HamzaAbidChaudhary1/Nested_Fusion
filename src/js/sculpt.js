/* NestedFusion — hero sculpture.
   Four rings on a real gimbal hierarchy (each ring is the parent of the next) around a cyan core.
   They arrive turning, idle open, and close flat into one nested mark as the hero scrolls away.
   Decorative: aria-hidden, no content depends on it. Bundled with esbuild into /assets/js/sculpt.js. */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, LatheGeometry, SphereGeometry, PlaneGeometry,
  MeshPhysicalMaterial, ShadowMaterial, HemisphereLight, DirectionalLight, Vector2, PMREMGenerator,
  NeutralToneMapping, VSMShadowMap, MathUtils, Timer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const host = document.querySelector('[data-sculpt]');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wide = window.matchMedia('(min-width: 1025px)');

function webgl2() {
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}

if (host && wide.matches && webgl2()) start(host);

function start(host) {
  const hero = host.closest('.hero');
  const canvas = host.querySelector('canvas');

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = VSMShadowMap; // soft, wide contact shadow; only the floor receives it

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();

  const camera = new PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0.5, 8.4);
  camera.lookAt(0, -0.32, 0);

  // Lights: soft sky from above, one key that casts the contact shadow, a cool rim from behind.
  scene.add(new HemisphereLight(0xffffff, 0xc4ced6, 1.1));
  const key = new DirectionalLight(0xffffff, 2.6);
  key.position.set(-1.6, 7, 2.4);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 16 });
  key.shadow.radius = 14;
  key.shadow.blurSamples = 16;
  scene.add(key);
  const rim = new DirectionalLight(0xdff4ff, 1.2);
  rim.position.set(4, 2, -5);
  scene.add(rim);

  // Materials: glazed ceramic, one ink ring, a cyan core. Same palette as the page.
  const ceramic = new MeshPhysicalMaterial({ color: 0xf2f5f7, roughness: 0.46, clearcoat: 0.7, clearcoatRoughness: 0.22 });
  const ink = new MeshPhysicalMaterial({ color: 0x14191f, roughness: 0.32, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.12 });
  const cyan = new MeshPhysicalMaterial({ color: 0x23d7ff, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08 });

  // A band with rounded edges, spun on a lathe, then turned to face the camera.
  function band(radius, thick, depth) {
    const r = Math.min(thick, depth) * 0.42, pts = [], seg = 6;
    const corner = (cx, cy, a0) => {
      for (let i = 0; i <= seg; i++) {
        const a = a0 + (i / seg) * Math.PI / 2;
        pts.push(new Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r));
      }
    };
    const x0 = radius - thick / 2, x1 = radius + thick / 2, y0 = -depth / 2, y1 = depth / 2;
    corner(x0 + r, y0 + r, Math.PI);         // inner bottom
    corner(x1 - r, y0 + r, Math.PI * 1.5);   // outer bottom
    corner(x1 - r, y1 - r, 0);               // outer top
    corner(x0 + r, y1 - r, Math.PI / 2);     // inner top
    pts.push(pts[0].clone());
    const g = new LatheGeometry(pts, 128);
    g.rotateX(Math.PI / 2);
    return g;
  }

  // Gimbal: ring 0 turns about Y, its child about X, and so on. Nested in code, not just in name.
  const spec = [
    { radius: 1.62, thick: 0.13, depth: 0.30, mat: ceramic, axis: 'y', open: 0.95 },
    { radius: 1.28, thick: 0.12, depth: 0.26, mat: ink,     axis: 'x', open: -1.15 },
    { radius: 0.96, thick: 0.11, depth: 0.23, mat: ceramic, axis: 'y', open: 1.05 },
    { radius: 0.66, thick: 0.10, depth: 0.20, mat: ceramic, axis: 'x', open: -0.85 },
  ];
  const root = new Group();
  root.rotation.x = -0.12;
  scene.add(root);
  let parent = root;
  const rings = spec.map((s, i) => {
    const pivot = new Group();
    const mesh = new Mesh(band(s.radius, s.thick, s.depth), s.mat);
    mesh.castShadow = true;
    pivot.add(mesh);
    parent.add(pivot);
    parent = pivot;
    return { pivot, ...s, phase: i * 1.7 };
  });
  const core = new Mesh(new SphereGeometry(0.34, 64, 32), cyan);
  core.castShadow = true;
  parent.add(core);

  const floor = new Mesh(new PlaneGeometry(6.5, 6.5), new ShadowMaterial({ opacity: 0.16 })); // kept inside the shadow camera so no edge ever shows
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.95;
  floor.receiveShadow = true;
  scene.add(floor);

  // Input: the cursor tilts the assembly, a drag spins the outer ring and lets it coast.
  const look = { x: 0, y: 0, tx: 0, ty: 0 };
  let spin = 0, spinV = 0, drag = null;
  window.addEventListener('pointermove', e => {
    look.tx = (e.clientX / innerWidth - 0.5) * 2;
    look.ty = (e.clientY / innerHeight - 0.5) * 2;
    if (drag !== null) { spinV = (e.clientX - drag) * 0.006; drag = e.clientX; }
  }, { passive: true });
  canvas.addEventListener('pointerdown', e => { drag = e.clientX; canvas.setPointerCapture(e.pointerId); host.classList.add('is-drag'); });
  const release = () => { drag = null; host.classList.remove('is-drag'); };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  // Scroll: as the hero leaves, the rings close flat. 0 = open, 1 = fused.
  let fuse = 0;
  const readScroll = () => {
    const r = hero.getBoundingClientRect();
    fuse = MathUtils.smoothstep(-r.top / r.height, 0.04, 0.62);
  };
  window.addEventListener('scroll', readScroll, { passive: true });
  readScroll();

  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host);
  resize();

  const easeOutExpo = t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const timer = new Timer();
  timer.connect(document);
  const INTRO = 2.2;
  let shown = false, visible = true;

  function pose(t) {
    // Arrival: rings start a full extra turn out and settle with an exponential ease.
    const arrive = reduce ? 1 : easeOutExpo(Math.min(t / INTRO, 1));
    const breathe = reduce ? 0.75 : 0.62 + 0.38 * Math.sin(t * 0.32);
    rings.forEach((r, i) => {
      const idle = r.open * breathe * (1 + 0.08 * Math.sin(t * 0.5 + r.phase));
      const settle = (1 - arrive) * (i % 2 ? -1 : 1) * (2.4 + i * 0.5);
      r.pivot.rotation[r.axis] = (idle + settle) * (1 - fuse) + (i === 0 ? spin : 0);
    });
    root.scale.setScalar(0.86 + 0.14 * arrive);
    core.scale.setScalar(1 - 0.12 * fuse);
  }

  function frame() {
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05);
    const t = timer.getElapsed();
    look.x += (look.tx - look.x) * Math.min(dt * 3, 1);
    look.y += (look.ty - look.y) * Math.min(dt * 3, 1);
    if (drag === null) spinV *= Math.pow(0.04, dt);
    spin += spinV;
    // Spin settles back to the nearest full turn once the hand lets go, so the fused mark lands square.
    if (drag === null && Math.abs(spinV) < 0.002) spin += (Math.round(spin / (Math.PI * 2)) * Math.PI * 2 - spin) * Math.min(dt * 2, 1);
    root.rotation.y = look.x * 0.32 + (reduce ? 0 : Math.sin(t * 0.17) * 0.12);
    root.rotation.x = -0.12 + look.y * 0.18;
    pose(t);
    renderer.render(scene, camera);
    if (!shown) { shown = true; hero.classList.add('has-sculpt'); }
  }

  if (reduce) {
    // One still frame, re-drawn only when the size changes.
    frame();
    new ResizeObserver(() => { resize(); renderer.render(scene, camera); }).observe(host);
    return;
  }

  // Draw only while on screen.
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    renderer.setAnimationLoop(visible ? frame : null);
  }, { rootMargin: '80px' }).observe(host);
  wide.addEventListener('change', e => renderer.setAnimationLoop(e.matches && visible ? frame : null));
  if (visible) renderer.setAnimationLoop(frame);
}
