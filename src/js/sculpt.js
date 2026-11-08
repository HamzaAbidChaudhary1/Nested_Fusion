/* NestedFusion — 3D pieces, modeled in Blender (src/blender/), shown with three.js r186.
   Every element with data-sculpt="<name>" becomes a stage for one model:
     fusion — fusion data core: aluminium dodecahedron, pentagon windows, light rings inside (showcase.py)
     hex    — hex core: nested cubes seen corner-on as hexagons around a glowing teal core (showcase.py);
              used in the home hero and above the closing call to action
   Each stage loads when it nears the viewport, draws only while visible, and is lit by the studio
   environment baked in Blender. Phones get a lighter renderer (see `lite`). Decorative: aria-hidden; the
   still or photo underneath stays as the fallback without WebGL2, on weak or data-saving devices, and
   until the model is ready.
   Bundled with esbuild into /assets/js/sculpt.js. */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, PlaneGeometry, MeshPhysicalMaterial, MeshBasicMaterial,
  ShadowMaterial, DirectionalLight, PMREMGenerator, EquirectangularReflectionMapping, NeutralToneMapping,
  VSMShadowMap, MathUtils, Color, Quaternion, Vector3, FrontSide, Sprite, SpriteMaterial, CanvasTexture,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const ASSETS = '/assets/3d/';
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Phones and tablets get a lighter renderer: lower resolution, a painted contact shadow instead of a
// real-time one, and 30 frames a second. Weak or data-saving devices keep the stills and photos.
const lite = window.matchMedia('(max-width: 1024px), (pointer: coarse)').matches;
function weakDevice() {
  const c = navigator.connection;
  return !!((c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) ||
    (navigator.deviceMemory && navigator.deviceMemory < 4) ||
    (lite && navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4));
}
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
let studio; // the baked HDR, fetched once and shared by every stage
const getStudio = () => (studio ??= new HDRLoader().loadAsync(ASSETS + 'studio.hdr'));

const Y = new Vector3(0, 1, 0), X = new Vector3(1, 0, 0), Z = new Vector3(0, 0, 1);
const easeOutExpo = t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const metal = (color, roughness) => new MeshPhysicalMaterial({ color, metalness: 1, roughness });

/* ------------------------------------------------------------------ models */
const MODELS = {
  fusion: {
    file: 'fusion-core.glb', mark: '.ph', fov: 24, cam: [0, 0.35, 8.6], look: [0, -0.42, 0], floor: -1.32, shadow: 0.12,
    setup(part) {
      part('Shell').material = Object.assign(metal(0xc9ced3, 0.3), { envMapIntensity: 1.1 });
      part('Gasket').material = new MeshPhysicalMaterial({ color: 0x15181b, roughness: 0.62 });
      part('InnerGasket').material = metal(0x3a3f45, 0.34);
      part('Windows').material = new MeshPhysicalMaterial({
        color: 0xffffff, roughness: 0.04, transmission: 1, thickness: 0.03, ior: 1.5, specularIntensity: 1,
      });
      part('Void').material = new MeshPhysicalMaterial({ color: 0x04070a, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08 });
      const energy = part('Energy');
      const glow = new Color(0x6fe6ff);
      energy.material = new MeshBasicMaterial({ color: glow.clone(), toneMapped: false });
      const ball = new Group();
      ['Shell', 'Gasket', 'InnerGasket', 'Windows', 'Void'].forEach(n => ball.add(part(n)));
      ball.add(energy);
      const root = new Group();
      root.add(ball);
      return {
        root,
        pose({ t, arrive, spin, enter }) {
          // Turns slowly, as a whole; the light rings inside run faster and breathe.
          ball.rotation.set(0.32 + Math.sin(t * 0.21) * 0.08, -0.4 + t * 0.16 + spin + (1 - arrive) * 2.4, 0);
          energy.rotation.set(t * 0.5, t * 0.37, 0);
          energy.material.color.copy(glow).multiplyScalar(0.82 + 0.18 * Math.sin(t * 2.1));
          root.scale.setScalar((0.84 + 0.16 * arrive) * (0.94 + 0.06 * enter));
        },
      };
    },
  },

  hex: {
    file: 'hex-core.glb', mark: 'section', fov: 24, cam: [0, 0.18, 8.2], look: [0, -0.22, 0], floor: -1.62, shadow: 0.07,
    setup(part) {
      const steel = metal(0xc4cad0, 0.26);
      const shell = part('Shell'), rim = part('Rim'), frame = part('Frame');
      const inner = part('Inner'), innerRim = part('InnerRim'), core = part('Core'), wires = part('Wires');
      // Outer glass is a clear tinted skin (not transmission) so the layers inside stay visible through it.
      shell.material = new MeshPhysicalMaterial({
        color: 0x6fcfcc, roughness: 0.12, metalness: 0, transparent: true, opacity: 0.34, clearcoat: 1,
        clearcoatRoughness: 0.08, depthWrite: false, envMapIntensity: 1.2,
      });
      shell.renderOrder = 2;
      rim.material = steel;
      innerRim.material = steel;
      frame.material = new MeshPhysicalMaterial({ color: 0x050809, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05 });
      inner.material = new MeshPhysicalMaterial({
        color: 0xeafcfc, roughness: 0.16, transmission: 1, thickness: 0.25, ior: 1.45,
        attenuationColor: new Color(0x9fe3e1), attenuationDistance: 1.5,
      });
      core.material = new MeshBasicMaterial({ color: 0x47e6e8, toneMapped: false });
      wires.material = new MeshBasicMaterial({ color: 0x3fb7b8, toneMapped: false });

      // A soft halo around the core, drawn over the layers so it reads through the glass.
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const g = c.getContext('2d'), grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(120,245,245,.95)');
      grad.addColorStop(0.35, 'rgba(60,210,215,.32)');
      grad.addColorStop(1, 'rgba(60,210,215,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 128, 128);
      const halo = new Sprite(new SpriteMaterial({ map: new CanvasTexture(c), depthTest: false, depthWrite: false }));
      halo.renderOrder = 10;

      // Three layers, each turning about the view axis; a cube's body diagonal faces the camera.
      // (Blender's (1,1,1) diagonal is (1,1,-1) once exported Y-up.)
      const align = new Quaternion().setFromUnitVectors(new Vector3(1, 1, -1).normalize(), Z);
      // Roll so one hexagon corner points straight up, as in the reference.
      const corner = new Vector3(1, -1, -1).applyQuaternion(align);
      const upright = Math.PI / 2 - Math.atan2(corner.y, corner.x);
      const layer = (...objs) => { const l = new Group(); objs.forEach(o => l.add(o)); return l; };
      const outer = layer(shell, rim, wires), mid = layer(frame), inside = layer(inner, innerRim, core);
      const root = new Group();
      root.add(outer, mid, inside, halo);
      const q = new Quaternion();
      const turn = (l, a) => l.quaternion.copy(q.setFromAxisAngle(Z, a)).multiply(align);
      const TAU3 = (Math.PI * 2) / 3; // the cube looks the same every third of a turn about its diagonal
      return {
        root,
        pose({ t, arrive, spin, enter }) {
          // Layers start out of step and fuse into one hexagon as the section scrolls in.
          const apart = 1 - enter * arrive, base = upright + Math.sin(t * 0.45) * 0.3 + spin; // sways, stays upright
          turn(outer, base);
          turn(mid, base - apart * TAU3 * 0.5);
          turn(inside, base + apart * TAU3 * 0.75);
          mid.scale.setScalar(1 + 0.08 * apart);
          const pulse = 0.5 + 0.5 * Math.sin(t * 1.6);
          halo.scale.setScalar(1.25 + 0.15 * pulse);
          halo.material.opacity = 0.75 + 0.25 * pulse;
          root.scale.setScalar(0.86 + 0.14 * arrive);
        },
      };
    },
  },
};

/* ------------------------------------------------------------------ stage */
function webgl2() {
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}

// The colour the canvas sits on, so glass refracts the page rather than a transparent hole.
function backdrop(el) {
  for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
    const c = getComputedStyle(n).backgroundColor;
    const m = c.match(/[\d.]+/g);
    if (m && (m.length < 4 || +m[3] > 0.9)) return new Color(c);
  }
  return new Color(0xe9eef2);
}

function blob() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.45, 'rgba(255,255,255,.55)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

async function start(host) {
  const cfg = MODELS[host.dataset.sculpt];
  if (!cfg) return;
  const canvas = host.querySelector('canvas');
  const marked = host.closest(cfg.mark) || host.parentElement;
  const [gltf, hdr] = await Promise.all([loader.loadAsync(ASSETS + cfg.file), getStudio()]);

  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: lite ? 'default' : 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1.5 : 1.75));
  renderer.toneMapping = NeutralToneMapping;
  renderer.shadowMap.enabled = !lite;
  renderer.shadowMap.type = VSMShadowMap;

  const scene = new Scene();
  scene.background = backdrop(host);
  const pmrem = new PMREMGenerator(renderer);
  hdr.mapping = EquirectangularReflectionMapping;
  scene.environment = pmrem.fromEquirectangular(hdr).texture;
  pmrem.dispose();

  const camera = new PerspectiveCamera(cfg.fov, 1, 0.1, 50);
  camera.position.set(...cfg.cam);
  camera.lookAt(...cfg.look);

  // One light, only for the soft contact shadow; the look comes from the baked studio.
  if (!lite) {
    const key = new DirectionalLight(0xffffff, 0.9);
    key.position.set(-0.5, 7.5, 1.4);
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 14 });
    key.shadow.radius = 16;
    key.shadow.blurSamples = 16;
    scene.add(key);
  }

  const part = name => gltf.scene.getObjectByName(name);
  const model = cfg.setup(part);
  model.root.traverse(o => { if (o.isMesh) o.castShadow = !lite; });
  scene.add(model.root);

  // Contact shadow: real-time on desktop; on phones a painted soft ellipse that costs nothing per frame.
  const floor = lite
    ? new Mesh(new PlaneGeometry(3.2, 3.2), new MeshBasicMaterial({ map: blob(), transparent: true, depthWrite: false, opacity: (cfg.shadow ?? 0.18) * 2.2, color: 0x1c2630 }))
    : new Mesh(new PlaneGeometry(4.6, 4.6), new ShadowMaterial({ opacity: cfg.shadow ?? 0.18 })); // inside the shadow camera
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = cfg.floor;
  floor.receiveShadow = !lite;
  scene.add(floor);

  // Input: the cursor tilts every model a little; dragging spins this one and lets it coast.
  const look = { x: 0, y: 0, tx: 0, ty: 0 };
  let spin = 0, spinV = 0, drag = null, hover = false, idle = 1;
  // Mouse over the model: it follows the cursor. Mouse elsewhere: it sways on its own, so the depth always shows.
  host.addEventListener('pointerenter', () => { hover = true; });
  host.addEventListener('pointerleave', () => { hover = false; });
  window.addEventListener('pointermove', e => {
    look.tx = (e.clientX / innerWidth - 0.5) * 2;
    look.ty = (e.clientY / innerHeight - 0.5) * 2;
    if (drag !== null) { spinV = (e.clientX - drag) * 0.006; drag = e.clientX; }
  }, { passive: true });
  canvas.addEventListener('pointerdown', e => { drag = e.clientX; canvas.setPointerCapture(e.pointerId); host.classList.add('is-drag'); });
  const release = () => { drag = null; host.classList.remove('is-drag'); };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  // Scroll: enter = 0→1 as the stage rises into view; leave = 0→1 as its section scrolls off the top.
  const state = { t: 0, arrive: 0, spin: 0, enter: 0, leave: 0 };
  const readScroll = () => {
    const r = host.getBoundingClientRect(), s = marked.getBoundingClientRect(), vh = innerHeight;
    state.enter = MathUtils.smoothstep((vh - r.top) / (vh * 0.75), 0.15, 1);
    state.leave = MathUtils.smoothstep(-s.top / s.height, 0.04, 0.6);
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

  const INTRO = 2.4;
  let last = 0, shown = false, visible = true;
  const STEP = lite ? 1000 / 31 : 0; // phones: 30 fps is plenty for slow motion and kinder to the battery
  function frame(now = 0) {
    if (STEP && last && now - last < STEP) return; // skip this vsync; the last frame stays on screen
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
    last = now;
    state.t = reduce ? 4 : state.t + dt; // own clock: it pauses while the stage is off-screen
    state.arrive = reduce ? 1 : easeOutExpo(Math.min(state.t / INTRO, 1));
    if (reduce) { state.enter = 1; state.leave = 0; }
    look.x += (look.tx - look.x) * Math.min(dt * 3, 1);
    look.y += (look.ty - look.y) * Math.min(dt * 3, 1);
    if (drag === null) spinV *= Math.pow(0.04, dt);
    spin += spinV;
    state.spin = spin;
    model.pose(state);
    idle += ((hover || drag !== null ? 0 : 1) - idle) * Math.min(dt * 2, 1);
    const wt = state.t;
    model.root.rotation.y = look.x * 0.28 + idle * Math.sin(wt * 0.55) * 0.38;
    model.root.rotation.x = look.y * 0.14 + idle * Math.sin(wt * 0.43 + 1.1) * 0.17;
    renderer.render(scene, camera);
    if (!shown) { shown = true; host.classList.add('is-on'); marked.classList.add('has-sculpt'); }
  }

  if (reduce) {
    frame();
    new ResizeObserver(() => { resize(); renderer.render(scene, camera); }).observe(host);
    return;
  }
  const run = on => { last = 0; renderer.setAnimationLoop(on ? frame : null); };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; run(visible); }, { rootMargin: '80px' }).observe(host);
  run(true);
}

/* ------------------------------------------------------------------ boot */
if (webgl2() && !weakDevice()) {
  const lazy = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      lazy.unobserve(e.target);
      start(e.target).catch(() => { /* the photo or plain layout stays */ });
    }
  }, { rootMargin: lite ? '300px 0px' : '600px 0px' });
  document.querySelectorAll('[data-sculpt]').forEach(host => {
    // A stage can ask to sit inside a neighbouring element, e.g. over a photo frame it replaces.
    const into = host.dataset.sculptInto && host.parentElement.querySelector(host.dataset.sculptInto);
    if (into) into.prepend(host);
    lazy.observe(host);
  });
}
