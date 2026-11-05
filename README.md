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
- `src/js/sculpt.js` — the home hero's 3D nested-ring sculpture (three.js r186). It is bundled, with only the three.js parts it uses, into `assets/js/sculpt.js`:
  `npx esbuild@0.25 src/js/sculpt.js --bundle --minify --format=esm --target=es2020 --outfile=assets/js/sculpt.js` (needs `npm i three@0.186.0` next to it), then `python3 build.py`.
  It loads only on screens 1025px and wider, after the page is idle, and only with WebGL2; phones and older browsers keep the photo reel. Reduced motion gets one still frame.
- `assets/video/` — looping background clips (MP4 + WebM fallback + poster). Add one with `{{VIDEO key="name" ratio="16/10"}}` in a page; files must be `name.mp4`, `name.webm`, `name-poster.jpg`

Motion respects `prefers-reduced-motion`.

## Run locally
```bash
python3 -m http.server 8080
```

## Deploy
Netlify builds from the `website-v2` branch, publish directory `.` (see `netlify.toml`). The contact form uses Netlify Forms — enable form detection in the project settings.
