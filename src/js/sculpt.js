/* NestedFusion — hero object.
   Modeled in Blender (src/blender/nested_core.py): a thin-walled glass case, a champagne-gold frame
   standing on its corner, and a graphite hub wiring a glossy black core to every corner of the frame.
   Lit by a studio environment baked in the same Blender scene. The case and its contents turn at
   different speeds so the nesting reads, then lock into line as the hero scrolls away.
   Decorative: aria-hidden, no content depends on it. Bundled with esbuild into /assets/js/sculpt.js. */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, PlaneGeometry, MeshPhysicalMaterial, ShadowMaterial,
  DirectionalLight, PMREMGenerator, EquirectangularReflectionMapping, NeutralToneMapping, VSMShadowMap,
  MathUtils, Timer, Color, Quaternion, Vector3, FrontSide,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const ASSETS = '/assets/3d/';
const host = document.querySelector('[data-sculpt]');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wide = window.matchMedia('(min-width: 1025px)');

function webgl2() {
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}

if (host && wide.matches && webgl2()) start(host).catch(() => { /* keep the poster */ });

async function start(host) {
  const hero = host.closest('.hero');
  const canvas = host.querySelector('canvas');

  const gltfLoader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const [gltf, hdr] = await Promise.all([
    gltfLoader.loadAsync(ASSETS + 'nested-core.glb'),
    new HDRLoader().loadAsync(ASSETS + 'studio.hdr'),
  ]);

  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = VSMShadowMap;

  const scene = new Scene();
  // Glass refracts what is behind it, so the scene carries the page colour (#E9EEF2) rather than transparency.
  scene.background = new Color(0xe9eef2);
  hdr.mapping = EquirectangularReflectionMapping;
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(hdr).texture;
  scene.environmentIntensity = 1.0;
  hdr.dispose();
  pmrem.dispose();

  const camera = new PerspectiveCamera(26, 1, 0.1, 50);
  camera.position.set(0, 0.55, 7.6);
  camera.lookAt(0, -0.12, 0);

  // One light only, for the contact shadow; the look comes from the baked studio.
  const key = new DirectionalLight(0xffffff, 0.9);
  key.position.set(-0.5, 7.5, 1.4);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 14 });
  key.shadow.radius = 16;
  key.shadow.blurSamples = 16;
  scene.add(key);

  // Parts by name, as modeled.
  const part = name => gltf.scene.getObjectByName(name);
  const glass = part('Glass'), frame = part('Frame'), network = part('Network'), core = part('Core');

  // Glass: real transmission with a teal body colour that only shows through the thick edges.
  glass.material = new MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.02, transmission: 1, thickness: 0.12, ior: 1.5,
    attenuationColor: new Color(0xbfe9f0), attenuationDistance: 3.5, specularIntensity: 1,
    iridescence: 0.12, iridescenceIOR: 1.33, iridescenceThicknessRange: [320, 440], side: FrontSide,
  });
  glass.castShadow = true;
  // Metals and enamel keep their Blender materials, tuned slightly for the real-time renderer.
  frame.material.roughness = 0.16;
  frame.material.envMapIntensity = 1.15;
  network.material.roughness = 0.32;
  core.material.color.set(0x050607); // glossy black, as set in the Blender source
  core.material.roughness = 0.12;
  core.material.clearcoat = 1;
  core.material.clearcoatRoughness = 0.04;
  [frame, network, core].forEach(m => { m.castShadow = true; });

  // The contents turn as one unit inside the case: wrap them, keeping their modeled orientation.
  const inner = new Group();
  [frame, network, core].forEach(o => inner.add(o));
  const root = new Group();
  root.add(glass, inner);
  scene.add(root);

  const floor = new Mesh(new PlaneGeometry(4.6, 4.6), new ShadowMaterial({ opacity: 0.18 })); // inside the shadow camera so its edge never shows
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.72;
  floor.receiveShadow = true;
  scene.add(floor);

  // Input: the cursor tilts the object, a drag spins the case and lets it coast.
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

  // Scroll: 0 = contents turning freely, 1 = locked square with the case.
  let lock = 0;
  const readScroll = () => {
    const r = hero.getBoundingClientRect();
    lock = MathUtils.smoothstep(-r.top / r.height, 0.04, 0.6);
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
  const INTRO = 2.4, Y = new Vector3(0, 1, 0), X = new Vector3(1, 0, 0);
  const qa = new Quaternion(), qb = new Quaternion();
  let shown = false, visible = true;

  function pose(t) {
    const arrive = reduce ? 1 : easeOutExpo(Math.min(t / INTRO, 1));
    // Case: a slow sway plus the user's spin; it arrives from a part-turn out.
    glass.rotation.set(0.18, -0.5 + Math.sin(t * 0.16) * 0.28 + spin + (1 - arrive) * 2.2, 0);
    // Contents: counter-rotate and nod while free; once locked they sit square with the case.
    const free = 1 - lock;
    qa.setFromAxisAngle(Y, (-t * 0.22 + 0.6 - (1 - arrive) * 3.0) * free + glass.rotation.y * lock);
    qb.setFromAxisAngle(X, (Math.sin(t * 0.27) * 0.3 + 0.18) * free + 0.18 * lock);
    inner.quaternion.copy(qb).multiply(qa);
    root.scale.setScalar(0.82 + 0.1 * arrive);
  }

  function frameLoop() {
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05);
    const t = reduce ? 4 : timer.getElapsed();
    look.x += (look.tx - look.x) * Math.min(dt * 3, 1);
    look.y += (look.ty - look.y) * Math.min(dt * 3, 1);
    if (drag === null) spinV *= Math.pow(0.04, dt);
    spin += spinV;
    root.rotation.y = look.x * 0.28;
    root.rotation.x = look.y * 0.14;
    pose(t);
    renderer.render(scene, camera);
    if (!shown) { shown = true; hero.classList.add('has-sculpt'); }
  }

  if (reduce) {
    // One still frame, redrawn only when the size changes.
    frameLoop();
    new ResizeObserver(() => { resize(); renderer.render(scene, camera); }).observe(host);
    return;
  }

  // Draw only while on screen and on a wide viewport.
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    renderer.setAnimationLoop(visible && wide.matches ? frameLoop : null);
  }, { rootMargin: '80px' }).observe(host);
  wide.addEventListener('change', e => renderer.setAnimationLoop(e.matches && visible ? frameLoop : null));
  renderer.setAnimationLoop(frameLoop);
}
