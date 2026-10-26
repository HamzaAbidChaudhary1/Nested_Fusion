"""Generate the NestedFusion site pages from src/pages/*.html.

Each page fragment starts with comment headers:
  <!--title: ...-->  <!--desc: ...-->  <!--active: services-->
and may use {{PHERO kicker="" title="Line 1|Line 2" lead=""}}, {{IMG key="voice" ratio="16/9" cls=""}}, {{VIDEO key="agents" ratio="16/10" cls=""}} and {{CTA}}.

Run:  python3 build.py   (writes index.html, <page>/index.html, 404.html)
"""
import datetime, hashlib, html, json, pathlib, re

ROOT = pathlib.Path(__file__).parent

# Public address of the site. Change this ONE line when the custom domain goes live.
SITE = "https://nestedfusion.netlify.app"

FOUNDER = {"@type": "Person", "@id": f"{SITE}/#founder", "name": "Hamza Abid Chaudhary",
           "jobTitle": "Founder & AI Solutions Engineer", "url": f"{SITE}/approach/",
           "sameAs": ["https://github.com/HamzaAbidChaudhary1"]}
ORG = {"@type": "ProfessionalService", "@id": f"{SITE}/#org", "name": "NestedFusion", "url": f"{SITE}/",
       "logo": f"{SITE}/assets/apple-touch-icon.png", "image": f"{SITE}/assets/og.png",
       "description": "NestedFusion designs, builds and runs production AI agents, voice agents and workflow automation for businesses in the US and Australia.",
       "areaServed": [{"@type": "Country", "name": "United States"}, {"@type": "Country", "name": "Australia"}],
       "knowsAbout": ["AI agents", "AI voice agents", "Workflow automation", "n8n", "Make.com", "GoHighLevel",
                      "LangChain", "LangGraph", "Retrieval-augmented generation", "Supabase", "Next.js"],
       "founder": {"@id": f"{SITE}/#founder"}, "sameAs": ["https://github.com/HamzaAbidChaudhary1"]}
WEBSITE = {"@type": "WebSite", "@id": f"{SITE}/#website", "url": f"{SITE}/", "name": "NestedFusion",
           "publisher": {"@id": f"{SITE}/#org"}, "inLanguage": "en-US"}
SERVICES = [
    ("AI agent development", "Custom AI agents that research, triage, draft and update records across your tools, with guardrails and human approval.", "agents"),
    ("AI voice agents", "Phone agents that answer and make calls, qualify callers, book appointments and log every call in your CRM.", "voice"),
    ("Workflow automation", "n8n, Make.com and GoHighLevel automation with error handling, retries and alerts.", "workflows"),
    ("AI apps and internal tools", "Copilots on your own data, client portals and dashboards built on Next.js, Supabase and FastAPI.", "apps"),
]
SRC = ROOT / "src" / "pages"


def ver(path):
    """Short content hash so every deploy gets a fresh URL and browsers never mix old and new files."""
    return hashlib.sha1((ROOT / path).read_bytes()).hexdigest()[:10]

NAV = [("services", "Services"), ("process", "Process"), ("work", "Work"), ("approach", "Approach"), ("faq", "FAQ")]
ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

# page key -> output path
PAGES = {
    "home": "index.html", "services": "services/index.html", "process": "process/index.html",
    "work": "work/index.html", "approach": "approach/index.html", "faq": "faq/index.html",
    "contact": "contact/index.html", "thanks": "thanks/index.html", "credits": "credits/index.html", "404": "404.html",
}


def url_for(key):
    return f"{SITE}/" if key == "home" else (f"{SITE}/404.html" if key == "404" else f"{SITE}/{key}/")


def head(title, desc, path, noindex=False, ld=None):
    t, d = html.escape(title), html.escape(desc)
    url = url_for(path)
    robots = '<meta name="robots" content="noindex">\n' if noindex else f'<link rel="canonical" href="{url}">\n'
    ld_json = json.dumps({"@context": "https://schema.org", "@graph": ld or []}, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    return f"""<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{t}</title>
<meta name="description" content="{d}">
{robots}<meta name="theme-color" content="#E9EEF2">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="NestedFusion">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:image" content="{SITE}/assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="NestedFusion: AI agents, voice agents and workflow automation">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{t}">
<meta name="twitter:description" content="{d}">
<meta name="twitter:image" content="{SITE}/assets/og.png">
<link rel="preload" href="/assets/fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css?v={ver('styles.css')}">
<script>document.documentElement.classList.add('js');try{{if(sessionStorage.getItem('nf-seen'))document.documentElement.classList.add('seen')}}catch(e){{}}</script>
<script type="application/ld+json">{ld_json}</script>
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
    <img class="loader__mark" src="/assets/mark-dark.svg" alt="" width="88" height="88">
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
    <a class="nav__logo" href="/" aria-label="NestedFusion home"><img src="/assets/logo-dark.svg" alt="NestedFusion" width="176" height="60"></a>
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
    lines = " ".join(f'<span class="line">{html.escape(l).replace("&amp;amp;", "&amp;")}</span>' for l in title.split("|"))
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


# Unsplash photos (hotlinked from Unsplash's CDN as their API terms require; downloads registered via the API).
# key: (photo path id, alt text, photographer name, unsplash username, photo page slug)
PHOTOS = {
    "permit":    ("photo-1721244654392-9c912a6eb236", "Blueprint elevation of a building with windows", "Amsterdam City Archives", "amsterdamcityarchives", "URnyBZCnlIs"),
    "dubai":     ("photo-1462007895615-c8c073bebcd8", "Dubai skyline at night", "Robert Bock", "robertbock", "cV4qkkorDFY"),
    "church":    ("photo-1699830506478-af7b3f5e6cc9", "Church interior with stained glass windows", "Jack Gardner", "jackgardner", "9S9YGw6nmCg"),
    "learning":  ("photo-1499914485622-a88fac536970", "Person working through an online course on a laptop", "Christin Hume", "christinhumephoto", "hBuwVLcYTnA"),
    "voice":     ("photo-1766066014237-00645c74e9c6", "Person wearing a headset working at a computer", "BaljkanN4", "baljkann4", "wnpf3Q5pkXA"),
    "workflows": ("photo-1680992044138-ce4864c2b962", "Close-up of server hardware with status lights", "Tyler", "tylergm", "vSprjjDbu60"),
    "apps":      ("photo-1555066931-4365d14bab8c", "Laptop screen showing application code", "Arnold Francisca", "clark_fransa", "f77Bh3inUpE"),
    "health":    ("photo-1758691461990-03b49d969495", "Clinician writing in a patient record", "Vitaly Gariev", "silverkblack", "8WYkI3cEZm8"),
    "wellness":  ("photo-1651528878442-720828f0e17e", "Wellness product bottles", "SUNDAY II SUNDAY", "sunday2sunday", "JK7q3Vktq0o"),
    "content":   ("photo-1676276375742-9e3d10e39d45", "Social media content plan on a whiteboard", "Walls.io", "walls_io", "sckgeg8lNMY"),
    "workshop":  ("photo-1677506048892-edde55cf3277", "Person presenting a process mapped on sticky notes", "Paymo", "paymo", "4wSnhAT8d9g"),
    "circuit":   ("photo-1727434032773-af3cd98375ba", "Close-up of a circuit board with data lines", "Luke Jones", "lukejonesdesign", "tBvF46kmwBw"),
}
UTM = "utm_source=nestedfusion&utm_medium=referral"


def video(key, cls="", ratio="16/9"):
    """Looping, muted, lazy-played background clip from /assets/video/<key>.mp4 with a poster still."""
    return (f'<figure class="ph ph--video {cls}" style="aspect-ratio:{ratio}"><div class="ph__in">'
            f'<video class="bgvid" muted loop playsinline preload="none" poster="/assets/video/{key}-poster.jpg" '
            f'data-src="/assets/video/{key}.mp4" aria-hidden="true"></video></div></figure>')


def img(key, cls="", ratio="16/9", sizes="(max-width: 720px) 100vw, 50vw", credit=False, eager=False):
    pid, alt, name, user, slug = PHOTOS[key]
    w, h = (int(x) for x in ratio.split("/"))
    base = f"https://images.unsplash.com/{pid}?auto=format&fit=crop&q=70&ar={w}:{h}"
    srcset = ", ".join(f"{base}&w={px} {px}w" for px in (480, 800, 1200, 1800))
    cap = (f'<figcaption class="ph__credit">Photo: <a href="https://unsplash.com/@{user}?{UTM}" target="_blank" rel="noopener">{html.escape(name)}</a>'
           f' / <a href="https://unsplash.com/photos/{slug}?{UTM}" target="_blank" rel="noopener">Unsplash</a></figcaption>') if credit else ""
    load = 'fetchpriority="high"' if eager else 'loading="lazy"'
    return (f'<figure class="ph {cls}" style="aspect-ratio:{ratio}"><div class="ph__in">'
            f'<img src="{base}&w=1200" srcset="{srcset}" sizes="{sizes}" alt="{html.escape(alt)}" {load} decoding="async" width="{w*100}" height="{h*100}">'
            f'</div>{cap}</figure>')


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
      <a href="/" aria-label="NestedFusion home"><img src="/assets/logo-dark.svg" alt="NestedFusion" width="150" height="51"></a>
      <nav aria-label="Footer">{links}</nav>
      <p>© <span id="yr">2026</span> NestedFusion. Serving the US &amp; Australia. <a class="footer__credits" href="/credits/">Photo credits</a></p>
    </div>
  </div>
</footer>

<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script src="/assets/vendor/lenis.min.js" defer></script>
<script src="/main.js?v={ver('main.js')}" defer></script>
</body>
</html>
"""


def render(key):
    raw = (SRC / f"{key}.html").read_text()
    meta = dict(re.findall(r"<!--(\w+): (.*?)-->", raw))
    body = re.sub(r"<!--\w+: .*?-->\n?", "", raw)
    body = re.sub(r"\{\{PHERO (.*?)\}\}", lambda m: phero(**dict(re.findall(r'(\w+)="(.*?)"', m.group(1)))), body)
    body = re.sub(r"\{\{IMG (.*?)\}\}", lambda m: (lambda a: img(a.pop("key"), **a))(dict(re.findall(r'(\w+)="(.*?)"', m.group(1)))), body)
    body = re.sub(r"\{\{VIDEO (.*?)\}\}", lambda m: (lambda a: video(a.pop("key"), **a))(dict(re.findall(r'(\w+)="(.*?)"', m.group(1)))), body)
    body = body.replace("{{CTA}}", CTA)
    if "{{CREDITS}}" in body:
        rows = "".join(
            f'<li><span>{html.escape(alt)}</span><span>Photo by <a href="https://unsplash.com/@{user}?{UTM}" target="_blank" rel="noopener">{html.escape(name)}</a> on <a href="https://unsplash.com/photos/{slug}?{UTM}" target="_blank" rel="noopener">Unsplash</a></span></li>'
            for _, (pid, alt, name, user, slug) in PHOTOS.items())
        body = body.replace("{{CREDITS}}", f'<ul class="credits">{rows}</ul>')
    noindex = key in ("thanks", "404", "credits")
    return head(meta["title"], meta["desc"], key, noindex, structured_data(key, meta, body)) + "\n" + header(meta.get("active", key)) + body + footer()


def _text(fragment):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", fragment))).strip()


def structured_data(key, meta, body):
    """JSON-LD graph per page: organisation + site everywhere, plus breadcrumbs, services, FAQ and page type."""
    url = url_for(key)
    page = {"@type": "WebPage", "@id": f"{url}#page", "url": url, "name": meta["title"], "description": meta["desc"],
            "isPartOf": {"@id": f"{SITE}/#website"}, "about": {"@id": f"{SITE}/#org"}, "inLanguage": "en-US"}
    graph = [ORG, WEBSITE, FOUNDER, page]
    if key != "home":
        name = dict(NAV).get(key, meta.get("crumb", key.title()))
        if key == "contact": name = "Contact"
        graph.append({"@type": "BreadcrumbList", "@id": f"{url}#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": name, "item": url}]})
        page["breadcrumb"] = {"@id": f"{url}#breadcrumb"}
    if key in ("home", "services"):
        for n, d, anchor in SERVICES:
            graph.append({"@type": "Service", "@id": f"{SITE}/services/#{anchor}", "name": n, "description": d,
                          "serviceType": n, "provider": {"@id": f"{SITE}/#org"}, "url": f"{SITE}/services/#{anchor}",
                          "areaServed": ORG["areaServed"]})
    if key == "faq":
        qa = re.findall(r"<summary>(.*?)</summary>\s*<div class=\"faq__a\">(.*?)</div>", body, re.S)
        page["@type"] = ["WebPage", "FAQPage"]
        page["mainEntity"] = [{"@type": "Question", "name": _text(q), "acceptedAnswer": {"@type": "Answer", "text": _text(a)}} for q, a in qa]
    if key == "work":
        page["@type"] = ["WebPage", "CollectionPage"]
    if key == "contact":
        page["@type"] = ["WebPage", "ContactPage"]
    if key == "approach":
        page["@type"] = ["WebPage", "AboutPage"]
    return graph


def write_sitemap():
    today = datetime.date.today().isoformat()
    keys = [k for k in PAGES if k not in ("thanks", "404", "credits")]
    prio = {"home": "1.0", "services": "0.9", "work": "0.9", "contact": "0.8"}
    rows = "".join(f"  <url><loc>{url_for(k)}</loc><lastmod>{today}</lastmod><priority>{prio.get(k, '0.7')}</priority></url>\n" for k in keys)
    (ROOT / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{rows}</urlset>\n')
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")


if __name__ == "__main__":
    for key, out in PAGES.items():
        p = ROOT / out
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(render(key))
        print("wrote", out)
    write_sitemap()
    print("wrote sitemap.xml, robots.txt")
