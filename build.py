"""Bundle the site into one self-contained HTML file (dist/index.html) for single-file hosting."""
import base64, re, pathlib
R = pathlib.Path(__file__).parent
OG = "https://raw.githubusercontent.com/HamzaAbidChaudhary1/Nested_Fusion/website-v2/assets/og.png"
def b64(p, mime): return f"data:{mime};base64," + base64.b64encode((R/p).read_bytes()).decode()
html = (R/"index.html").read_text()
css = (R/"styles.css").read_text()
for f in re.findall(r"url\((assets/fonts/[^)]+)\)", css): css = css.replace(f"url({f})", f"url({b64(f,'font/woff2')})")
html = re.sub(r'<link rel="preload"[^>]+>\n', "", html)
html = html.replace('<link rel="stylesheet" href="styles.css">', f"<style>{css}</style>")
for svg in ["assets/logo.svg", "assets/mark.svg", "assets/favicon.svg"]:
    html = html.replace(f'"{svg}"', f'"{b64(svg,"image/svg+xml")}"')
html = html.replace('href="assets/apple-touch-icon.png"', f'href="{b64("assets/apple-touch-icon.png","image/png")}"')
html = html.replace('content="/assets/og.png"', f'content="{OG}"')
html = html.replace('action="/thanks.html"', 'action="/"')
def inline_js(m):
    src = m.group(1); return "<script>" + (R/src).read_text().replace("</script", "<\\/script") + "</script>"
html = re.sub(r'<script src="([^"]+)" defer></script>', inline_js, html)
# scripts were deferred; run main after DOM parse by keeping them at end of body (they are)
(R/"dist").mkdir(exist_ok=True); (R/"dist/index.html").write_text(html)
print("dist/index.html", len(html)//1024, "KB")
