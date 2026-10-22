# NestedFusion — website (v2)

Static, dependency-free marketing site for NestedFusion. Plain HTML/CSS/JS — no build step.

- `index.html` — single-page site
- `styles.css` — design tokens and styles
- `main.js` — motion (GSAP + ScrollTrigger + SplitText, Lenis smooth scroll), hero agent-network canvas, Netlify Forms submit
- `assets/` — logo (vector, traced from brand banner), fonts (self-hosted), vendor libs, OG image

Motion respects `prefers-reduced-motion`.

## Run locally
```bash
python3 -m http.server 8080
```

## Deploy
Netlify, publish directory `.` (see `netlify.toml`). The contact form uses Netlify Forms — enable form detection in the Netlify project settings.
