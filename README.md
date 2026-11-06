# NestedFusion — website (v2)

Static multi-page marketing site for NestedFusion. Plain HTML/CSS/JS, no framework.

## Pages
`/` home · `/services/` · `/process/` · `/work/` · `/approach/` · `/faq/` · `/contact/` · `/thanks/` · `404.html`

## Editing
Page content lives in `src/pages/*.html`. The shared head, nav, footer, page hero and call-to-action band live in `build.py`.
After editing, regenerate the pages and commit the output:

```bash
python3 build.py
```

- `styles.css` — design tokens and styles
- `main.js` — motion (GSAP + ScrollTrigger + SplitText, Lenis), hero network canvas, page transitions, work filters, Netlify Forms submit
- `assets/` — logo (vector), fonts (self-hosted), vendor libs, OG image
- **3D pieces** — built in Blender. The original hero object (gold frame in glass, no longer on the site): `src/blender/nested_core.py` builds it headless with Blender's Python module (`pip install bpy`, Blender 5.2).
  - `python3 src/blender/nested_core.py export nested-core.glb` → compress with `npx @gltf-transform/cli optimize nested-core.glb assets/3d/nested-core.glb --compress meshopt --join false --flatten false --instance false`
  - `python3 src/blender/nested_core.py env assets/3d/studio.hdr 1024` bakes the studio lighting used on the web; `render out.png 800 64` makes a Cycles preview
  - `python3 src/blender/showcase.py export <hex|fusion> out.glb` builds the hex core (home hero, and the closing section on every page; `render hex` makes the still used on phones, `assets/3d/hex-core.webp`) and the fusion data core (the "Watch an agent work" card); compress them the same way into `assets/3d/hex-core.glb` and `assets/3d/fusion-core.glb`
  - Place one with `<div class="sculpt" data-sculpt="fusion|hex" aria-hidden="true"><canvas></canvas></div>`; models and their motion are configured in `MODELS` in `src/js/sculpt.js`
  - `src/js/sculpt.js` loads them with three.js r186 and is bundled to `assets/js/sculpt.js`: `npx esbuild@0.25 src/js/sculpt.js --bundle --minify --format=esm --target=es2020 --outfile=assets/js/sculpt.js` (with `npm i three@0.186.0`), then `python3 build.py`
  - Loads only at 1025px and wider, after the page is idle, with WebGL2; phones and older browsers keep the photo reel. Reduced motion gets one still frame.
- `assets/video/` — looping background clips (MP4 + WebM fallback + poster). Add one with `{{VIDEO key="name" ratio="16/10"}}` in a page; files must be `name.mp4`, `name.webm`, `name-poster.jpg`

Motion respects `prefers-reduced-motion`.

## Run locally
```bash
python3 -m http.server 8080
```

## Deploy
Netlify builds from the `website-v2` branch, publish directory `.` (see `netlify.toml`). The contact form uses Netlify Forms — enable form detection in the project settings.
