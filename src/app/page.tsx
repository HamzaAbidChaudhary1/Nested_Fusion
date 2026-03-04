"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Section from "@/components/section";
import Badge from "@/components/badge";

const marqueeItems = [
  "n8n", "Make.com", "Zapier", "Custom GPTs", "Supabase", "Node.js",
  "React", "GHL", "Notion API", "OpenAI", "Gemini", "Claude API",
];

const services = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Workflow Automation",
    description: "Multi-platform automations using n8n, Make.com, and Zapier that connect your entire tech stack into seamless, self-running pipelines.",
    tag: "n8n \u00b7 Make \u00b7 Zapier",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    title: "Custom AI Agents",
    description: "Purpose-built GPTs and AI agents trained on your domain data — from NDIS report writers to real estate assistants to product intelligence bots.",
    tag: "GPT \u00b7 Gemini \u00b7 Claude",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Full-Stack Apps",
    description: "Custom web applications with React frontends, Node.js backends, Supabase databases, and complete deployment — not just prototypes.",
    tag: "React \u00b7 Node \u00b7 Supabase",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "CRM Integration",
    description: "Deep integrations with GoHighLevel, HubSpot, and custom CRMs — booking flows, pipeline management, and automated follow-ups.",
    tag: "GHL \u00b7 HubSpot \u00b7 Webhooks",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      </svg>
    ),
    title: "Content Automation",
    description: "Automated newsletter generation, social media pipelines, EDM campaigns, and content repurposing systems powered by AI.",
    tag: "Notion \u00b7 EDM \u00b7 Social",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "AI Strategy & Training",
    description: "1:1 AI Champions sessions, team training programs, and strategic roadmaps to embed AI across your operations systematically.",
    tag: "Training \u00b7 Strategy",
  },
];

const processSteps = [
  { num: "01", title: "Discovery Audit", description: "We map every manual process, bottleneck, and data silo in your operation. No assumptions — just evidence." },
  { num: "02", title: "Architecture Design", description: "We design the automation blueprint — which tools, which APIs, which AI models, and how they connect into one system." },
  { num: "03", title: "Build & Iterate", description: "Rapid development in 1-2 week sprints. You see working automations fast, not a slide deck of promises." },
  { num: "04", title: "Deploy & Support", description: "Production deployment with monitoring, documentation, and ongoing support. We don't disappear after launch." },
];

const techItems = [
  {
    icon: (
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polyline points="16,18 22,12 16,6" /><polyline points="8,6 2,12 8,18" />
      </svg>
    ),
    title: "Automation Platforms",
    tools: "n8n \u00b7 Make.com \u00b7 Zapier \u00b7 Power Automate",
  },
  {
    icon: (
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
    ),
    title: "AI Models & APIs",
    tools: "OpenAI \u00b7 Claude \u00b7 Gemini \u00b7 Custom Fine-tunes",
  },
  {
    icon: (
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><circle cx="6" cy="6" r="1" /><circle cx="6" cy="18" r="1" />
      </svg>
    ),
    title: "Backend & Data",
    tools: "Node.js \u00b7 Supabase \u00b7 Express \u00b7 PostgreSQL",
  },
  {
    icon: (
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Frontend & CRM",
    tools: "React \u00b7 Next.js \u00b7 GoHighLevel \u00b7 HubSpot",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 pt-32 pb-20 md:px-12 md:pt-36 md:pb-24">
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse 70% 50% at 50% 40%, black 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 40%, black 20%, transparent 70%)",
          }}
        />
        {/* Glow */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(circle,rgba(200,255,0,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge>AI Automation Consultancy</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-10 font-display text-[clamp(52px,7.5vw,110px)] leading-[0.95] font-normal tracking-tight max-w-[900px]"
          >
            We build the<br />systems that<br /><em className="italic text-accent">think</em> for you
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 text-lg leading-relaxed text-text-secondary max-w-[520px]"
          >
            End-to-end AI automation for businesses ready to eliminate manual work, reduce costs, and scale operations — without hiring more people.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-accent text-bg text-[15px] font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(200,255,0,0.15),0_0_80px_rgba(200,255,0,0.06)] hover:-translate-y-0.5"
            >
              Start a Project
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-8 py-4 text-text-primary text-[15px] font-medium border border-border-light rounded-full transition-all duration-300 hover:border-text-muted hover:bg-bg-card"
            >
              See How It Works
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-20 pt-10 border-t border-border flex flex-col sm:flex-row gap-14"
          >
            {[
              { value: "50+", label: "Automations Deployed" },
              { value: "12k", label: "Hours Saved for Clients" },
              { value: "98%", label: "Client Retention Rate" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-[42px] text-text-primary leading-none">{stat.value}</div>
                <div className="mt-2 text-[13px] text-text-muted tracking-wide">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="py-8 border-t border-b border-border overflow-hidden">
        <div className="flex gap-12 animate-marquee w-max">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="font-mono text-[13px] text-text-muted tracking-[2px] uppercase whitespace-nowrap flex items-center gap-12">
              {item}
              <span className="text-[8px] text-accent opacity-50">{"\u25C6"}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <Section id="services">
        <div className="font-mono text-[11px] tracking-[4px] uppercase text-accent mb-5">What We Build</div>
        <h2 className="font-display text-[clamp(36px,4vw,56px)] leading-[1.1] max-w-[600px] mb-16">
          Automation that replaces entire workflows, not just tasks
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-bg-card p-10 transition-all duration-500 hover:bg-bg-card-hover hover:border-border-light hover:-translate-y-1 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-accent before:to-transparent before:opacity-0 before:transition-opacity before:duration-400 hover:before:opacity-100"
            >
              <div className="w-12 h-12 rounded-[10px] bg-accent/8 border border-accent/15 flex items-center justify-center mb-7">
                {service.icon}
              </div>
              <h3 className="font-display text-2xl font-normal mb-3.5">{service.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{service.description}</p>
              <span className="inline-block mt-5 font-mono text-[11px] tracking-wider text-accent-dim px-3 py-1.5 border border-accent/12 rounded-full">
                {service.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── PROCESS ── */}
      <Section alt id="process">
        <div className="font-mono text-[11px] tracking-[4px] uppercase text-accent mb-5">How We Work</div>
        <h2 className="font-display text-[clamp(36px,4vw,56px)] leading-[1.1] max-w-[600px] mb-16">
          From chaos to clockwork in four steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-2xl overflow-hidden">
          {processSteps.map((step) => (
            <div key={step.num} className="bg-bg p-10 md:p-12 transition-all duration-400 hover:bg-bg-card group">
              <div className="font-display text-[64px] text-border-light leading-none mb-6 transition-colors duration-400 group-hover:text-accent">
                {step.num}
              </div>
              <h3 className="text-base font-semibold mb-3">{step.title}</h3>
              <p className="text-[13px] leading-relaxed text-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── TECH STACK ── */}
      <Section id="stack">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="font-mono text-[11px] tracking-[4px] uppercase text-accent mb-5">Our Stack</div>
            <h2 className="font-display text-[clamp(36px,4vw,56px)] leading-[1.1] max-w-[600px]">
              Platform-agnostic. Problem-obsessed.
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed mt-6 mb-10 max-w-[440px]">
              We don&apos;t push one tool. We pick the right combination for your problem — whether that&apos;s a no-code workflow or a custom-coded solution.
            </p>
            <div className="flex flex-col gap-4">
              {techItems.map((item) => (
                <div key={item.title} className="flex items-center gap-4 px-6 py-5 bg-bg-card border border-border rounded-xl transition-all duration-300 hover:border-border-light hover:translate-x-1">
                  <div className="w-10 h-10 bg-accent/6 rounded-lg flex items-center justify-center shrink-0 text-accent">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold">{item.title}</h4>
                    <p className="text-xs text-text-muted">{item.tools}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orbit visual */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[480px] bg-bg-card border border-border rounded-2xl overflow-hidden flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(200,255,0,0.08)_0%,transparent_50%),radial-gradient(circle_at_70%_70%,rgba(200,255,0,0.04)_0%,transparent_50%)]" />
            <div className="relative w-[320px] h-[320px]">
              {/* Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] bg-accent rounded-2xl flex items-center justify-center font-mono text-[11px] font-bold text-bg tracking-wider z-10 shadow-[0_0_60px_rgba(200,255,0,0.15)]">
                NF
              </div>
              {/* Ring 1 */}
              <div className="absolute top-1/2 left-1/2 w-[180px] h-[180px] -mt-[90px] -ml-[90px] border border-border rounded-full animate-spin-orbit" style={{ animationDuration: "20s" }}>
                <div className="absolute -top-5 left-1/2 -ml-5 w-10 h-10 bg-bg-card border border-border-light rounded-[10px] flex items-center justify-center animate-counter-spin" style={{ animationDuration: "20s" }}>
                  <span className="font-mono text-[9px] text-text-secondary">n8n</span>
                </div>
                <div className="absolute -bottom-5 left-1/2 -ml-5 w-10 h-10 bg-bg-card border border-border-light rounded-[10px] flex items-center justify-center animate-counter-spin" style={{ animationDuration: "20s" }}>
                  <span className="font-mono text-[9px] text-text-secondary">GPT</span>
                </div>
              </div>
              {/* Ring 2 */}
              <div className="absolute top-1/2 left-1/2 w-[260px] h-[260px] -mt-[130px] -ml-[130px] border border-border rounded-full animate-spin-orbit-reverse" style={{ animationDuration: "30s" }}>
                <div className="absolute -top-5 left-1/2 -ml-5 w-10 h-10 bg-bg-card border border-border-light rounded-[10px] flex items-center justify-center animate-counter-spin-reverse" style={{ animationDuration: "30s" }}>
                  <span className="font-mono text-[9px] text-text-secondary">API</span>
                </div>
                <div className="absolute top-1/2 -right-5 -mt-5 w-10 h-10 bg-bg-card border border-border-light rounded-[10px] flex items-center justify-center animate-counter-spin-reverse" style={{ animationDuration: "30s" }}>
                  <span className="font-mono text-[9px] text-text-secondary">DB</span>
                </div>
                <div className="absolute -bottom-5 left-1/2 -ml-5 w-10 h-10 bg-bg-card border border-border-light rounded-[10px] flex items-center justify-center animate-counter-spin-reverse" style={{ animationDuration: "30s" }}>
                  <span className="font-mono text-[9px] text-text-secondary">CRM</span>
                </div>
              </div>
              {/* Ring 3 */}
              <div className="absolute top-1/2 left-1/2 w-[340px] h-[340px] -mt-[170px] -ml-[170px] border border-border rounded-full animate-spin-orbit-slow" style={{ animationDuration: "40s" }}>
                <div className="absolute top-[10%] -left-5 w-10 h-10 bg-bg-card border border-border-light rounded-[10px] flex items-center justify-center animate-counter-spin-slow" style={{ animationDuration: "40s" }}>
                  <span className="font-mono text-[9px] text-text-secondary">AI</span>
                </div>
                <div className="absolute bottom-[10%] -right-5 w-10 h-10 bg-bg-card border border-border-light rounded-[10px] flex items-center justify-center animate-counter-spin-slow" style={{ animationDuration: "40s" }}>
                  <span className="font-mono text-[9px] text-text-secondary">WEB</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section id="contact">
        <div className="relative text-center py-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(200,255,0,0.06)_0%,transparent_60%)] pointer-events-none" />
          <div className="relative">
            <div className="font-mono text-[11px] tracking-[4px] uppercase text-accent mb-5">Ready?</div>
            <h2 className="font-display text-[clamp(40px,5vw,72px)] leading-[1.05] mb-6">
              Let&apos;s build<br />something <em className="italic text-accent">relentless</em>
            </h2>
            <p className="text-[17px] text-text-secondary max-w-[480px] mx-auto leading-relaxed mb-10">
              Book a free 30-minute discovery call. We&apos;ll audit your current operations and show you exactly where AI automation saves you time and money.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-accent text-bg text-[15px] font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(200,255,0,0.15),0_0_80px_rgba(200,255,0,0.06)] hover:-translate-y-0.5"
            >
              Book Discovery Call
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
