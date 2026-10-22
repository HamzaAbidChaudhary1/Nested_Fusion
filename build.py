"""Generate the NestedFusion site pages from src/pages/*.html.

Each page fragment starts with comment headers:
  <!--title: ...-->  <!--desc: ...-->  <!--active: services-->
and may use {{PHERO kicker="" title="Line 1|Line 2" lead=""}} and {{CTA}}.

Run:  python3 build.py   (writes index.html, <page>/index.html, 404.html)
"""
import html, pathlib, re

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src" / "pages"

NAV = [("services", "Services"), ("process", "Process"), ("work", "Work"), ("approach", "Approach"), ("faq", "FAQ")]
ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

# page key -> output path
PAGES = {
    "home": "index.html", "services": "services/index.html", "process": "process/index.html",
    "work": "work/index.html", "approach": "approach/index.html", "faq": "faq/index.html",
    "contact": "contact/index.html", "thanks": "thanks/index.html", "404": "404.html",
}


def head(title, desc, path, noindex=False):
    t, d = html.escape(title), html.escape(desc)
    robots = '<meta name="robots" content="noindex">\n' if noindex else ""
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{t}</title>
<meta name="description" content="{d}">
{robots}<meta name="theme-color" content="#05080e">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:image" content="/assets/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="/assets/fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
<script>document.documentElement.classList.add('js');try{{if(sessionStorage.getItem('nf-seen'))document.documentElement.classList.add('seen')}}catch(e){{}}</script>
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"ProfessionalService","name":"NestedFusion","description":"AI agents, voice agents and workflow automation for growing teams.","founder":{{"@type":"Person","name":"Hamza Abid Chaudhary","jobTitle":"Founder & Forward Deployed Engineer"}},"areaServed":["AU","GB"]}}</script>
</head>"""


def header(active):
    def link(key, label, cls=""):
        cur = ' aria-current="page"' if key == active else ""
        on = " is-active" if key == active else ""
        return f'<a class="{cls}{on}" href="/{key}/"{cur}>{label}</a>'.replace('class=""', "").replace('class=" ', 'class="')
    desk = "\n      ".join(link(k, l) for k, l in NAV)
    mob = "\n    ".join(link(k, l) for k, l in NAV)
    loader = """
<div class="loader" aria-hidden="true">
  <div class="loader__inner">
    <img class="loader__mark" src="/assets/mark.svg" alt="" width="88" height="88">
    <div class="loader__bar"><span></span></div>
  </div>
</div>
""" if active == "home" else ""
    return f"""<body class="page-{active}">
<a class="skip" href="#main">Skip to content</a>
{loader}
<div class="progress" aria-hidden="true"><span></span></div>

<header class="nav" id="top">
  <div class="nav__in">
    <a class="nav__logo" href="/" aria-label="NestedFusion home"><img src="/assets/logo.svg" alt="NestedFusion" width="176" height="60"></a>
    <nav class="nav__links" aria-label="Primary">
      {desk}
    </nav>
    <a class="btn btn--sm btn--primary nav__cta magnetic" href="/contact/"><span>Book a call</span></a>
    <button class="nav__toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span></span><span></span></button>
  </div>
  <div class="mmenu" id="mobile-menu" hidden>
    <a href="/">Home</a>
    {mob}
    <a class="btn btn--primary" href="/contact/"><span>Book a discovery call</span></a>
  </div>
</header>

<main id="main">
"""


def phero(kicker, title, lead):
    lines = "".join(f'<span class="line">{html.escape(l).replace("&amp;amp;", "&amp;")}</span>' for l in title.split("|"))
    return f"""<section class="phero" aria-labelledby="page-title">
  <canvas class="hero__net" aria-hidden="true"></canvas>
  <div class="hero__glow" aria-hidden="true"></div>
  <div class="wrap phero__in">
    <p class="kicker reveal-up"><span class="dot"></span>{html.escape(kicker)}</p>
    <h1 id="page-title" class="phero__title hero__title">{lines}</h1>
    <p class="lead phero__lead reveal-up">{html.escape(lead)}</p>
  </div>
</section>
"""


CTA = f"""<section class="cta" aria-labelledby="cta-title">
  <div class="cta__glow" aria-hidden="true"></div>
  <div class="wrap cta__in">
    <p class="kicker"><span class="dot"></span>Start here</p>
    <h2 id="cta-title" class="h1 split">Let’s automate the boring part.</h2>
    <p class="lead">Tell us which task eats your team’s week. We reply within one business day.</p>
    <div class="cta__actions">
      <a class="btn btn--primary btn--lg magnetic" href="/contact/"><span>Book a discovery call</span>{ARROW}</a>
      <a class="btn btn--ghost btn--lg" href="/work/"><span>See the work</span></a>
    </div>
  </div>
</section>
"""


def footer():
    links = "".join(f'<a href="/{k}/">{l}</a>' for k, l in NAV) + '<a href="/contact/">Contact</a>'
    return f"""
</main>

<footer class="footer">
  <div class="wrap">
    <div class="footer__big" aria-hidden="true">nestedfusion</div>
    <div class="footer__row">
      <a href="/" aria-label="NestedFusion home"><img src="/assets/logo.svg" alt="NestedFusion" width="150" height="51"></a>
      <nav aria-label="Footer">{links}</nav>
      <p>© <span id="yr">2026</span> NestedFusion. Serving Australia &amp; the UK.</p>
    </div>
  </div>
</footer>

<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script src="/assets/vendor/lenis.min.js" defer></script>
<script src="/main.js" defer></script>
</body>
</html>
"""


def render(key):
    raw = (SRC / f"{key}.html").read_text()
    meta = dict(re.findall(r"<!--(\w+): (.*?)-->", raw))
    body = re.sub(r"<!--\w+: .*?-->\n?", "", raw)
    body = re.sub(r"\{\{PHERO (.*?)\}\}", lambda m: phero(**dict(re.findall(r'(\w+)="(.*?)"', m.group(1)))), body)
    body = body.replace("{{CTA}}", CTA)
    noindex = key in ("thanks", "404")
    return head(meta["title"], meta["desc"], key, noindex) + "\n" + header(meta.get("active", key)) + body + footer()


if __name__ == "__main__":
    for key, out in PAGES.items():
        p = ROOT / out
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(render(key))
        print("wrote", out)
