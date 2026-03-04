"use client";

import { motion } from "framer-motion";
import Section from "@/components/section";
import Badge from "@/components/badge";

const values = [
  {
    title: "Practical Over Theoretical",
    description: "Every solution we deliver is implementation-ready. We focus on tangible outcomes, not slide decks.",
  },
  {
    title: "Integration-First Thinking",
    description: "Modern businesses run on dozens of tools. We design systems that connect them seamlessly.",
  },
  {
    title: "Measurable ROI",
    description: "We track the impact of every automation — hours saved, errors eliminated, and revenue unlocked.",
  },
  {
    title: "Compliance by Design",
    description: "Especially in healthcare and regulated industries, we build guardrails and accuracy frameworks from day one.",
  },
];

const timeline = [
  {
    period: "2021 \u2013 2023",
    title: "Foundations in Automation",
    description: "Started building workflow automations and full-stack applications, developing expertise in n8n, Make.com, and API integration.",
  },
  {
    period: "2023 \u2013 2024",
    title: "Enterprise Experience",
    description: "Worked as Automations Technician at an Australian AI consultancy \u2014 managing multi-client projects, facilitating AI training programs, and building enterprise-grade solutions.",
  },
  {
    period: "2024 \u2013 Present",
    title: "NestedFusion",
    description: "Founded NestedFusion to bring enterprise-quality AI automation to businesses globally. Serving clients across Australia, US, MENA, and beyond.",
  },
];

const expertise = [
  "n8n & Make.com workflow architecture",
  "Custom GPT & AI agent development",
  "Full-stack web application development",
  "REST API & webhook integration design",
  "AI compliance & accuracy frameworks",
];

const workStyle = [
  "Direct, solutions-oriented communication",
  "Iterative development with feedback loops",
  "Flexible across AU, US, EU, and MENA time zones",
  "Strong emphasis on debugging and reliability",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative px-6 pt-36 pb-20 md:px-12 md:pt-44 md:pb-28">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(37,99,235,0.04)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge>About NestedFusion</Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-10 font-display text-[clamp(40px,6vw,80px)] leading-[0.95] font-normal tracking-tight max-w-[800px]"
          >
            Building intelligent systems for <em className="italic text-accent">growing</em> businesses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 text-lg leading-relaxed text-text-secondary max-w-[560px]"
          >
            NestedFusion is an AI automation consultancy founded by Hamza Abid Chaudhary. We specialize in workflow automation, custom GPT development, and full-stack solutions — helping businesses eliminate manual work and scale operations.
          </motion.p>
        </div>
      </section>

      {/* Founder */}
      <Section alt>
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="font-mono text-[11px] tracking-[4px] uppercase text-accent mb-5">Founder</div>
            <h2 className="font-display text-[clamp(32px,3.5vw,48px)] leading-[1.1] mb-8">Hamza Abid Chaudhary</h2>
            <div className="space-y-5 text-[15px] leading-relaxed text-text-secondary">
              <p>
                With 3+ years of experience in automation development, full-stack engineering, and AI integration, I&apos;ve built everything from compliance-critical healthcare GPTs to enterprise-scale workflow automations.
              </p>
              <p>
                My time as an Automations Technician at an Australian AI consultancy gave me firsthand experience in multi-client project management, cross-functional collaboration, ethical AI implementation, and facilitating AI adoption training programs for enterprise teams.
              </p>
              <p>
                Today, I run NestedFusion remotely from Pakistan, serving clients across Australia, the US, MENA, and globally — bringing enterprise-grade AI automation to businesses of every size.
              </p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-bg-card p-8">
              <h3 className="text-base font-semibold mb-5">Core Expertise</h3>
              <ul className="space-y-3">
                {expertise.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-bg-card p-8">
              <h3 className="text-base font-semibold mb-5">Working With Me</h3>
              <ul className="space-y-3">
                {workStyle.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Journey */}
      <Section>
        <div className="text-center mb-16">
          <div className="font-mono text-[11px] tracking-[4px] uppercase text-accent mb-5">Journey</div>
          <h2 className="font-display text-[clamp(32px,3.5vw,48px)] leading-[1.1]">
            From enterprise to independent consultancy
          </h2>
        </div>
        <div className="mx-auto max-w-2xl space-y-12">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pl-8 border-l border-border"
            >
              <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg" />
              <span className="font-mono text-[11px] tracking-[2px] uppercase text-accent">{item.period}</span>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section alt>
        <div className="text-center mb-16">
          <div className="font-mono text-[11px] tracking-[4px] uppercase text-accent mb-5">Approach</div>
          <h2 className="font-display text-[clamp(32px,3.5vw,48px)] leading-[1.1]">How we work</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-bg-card p-10 transition-all duration-400 hover:bg-bg-card-hover hover:border-border-light"
            >
              <h3 className="font-display text-xl font-normal mb-3">{value.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
