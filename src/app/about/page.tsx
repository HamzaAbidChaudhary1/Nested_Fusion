import type { Metadata } from "next";
import Section from "@/components/section";
import Badge from "@/components/badge";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about NestedFusion and founder Hamza Abid Chaudhary — 3+ years building AI automation solutions for global clients.",
};

const values = [
  {
    title: "Practical Over Theoretical",
    description:
      "Every solution we deliver is implementation-ready. We focus on tangible outcomes, not slide decks.",
  },
  {
    title: "Integration-First Thinking",
    description:
      "Modern businesses run on dozens of tools. We design systems that connect them seamlessly.",
  },
  {
    title: "Measurable ROI",
    description:
      "We track the impact of every automation — hours saved, errors eliminated, and revenue unlocked.",
  },
  {
    title: "Compliance by Design",
    description:
      "Especially in healthcare and regulated industries, we build guardrails and accuracy frameworks from day one.",
  },
];

const timeline = [
  {
    period: "2021 – 2023",
    title: "Foundations in Automation",
    description:
      "Started building workflow automations and full-stack applications, developing expertise in n8n, Make.com, and API integration.",
  },
  {
    period: "2023 – 2024",
    title: "Enterprise Experience",
    description:
      "Worked as Automations Technician at an Australian AI consultancy — managing multi-client projects, facilitating AI training programs, and building enterprise-grade solutions.",
  },
  {
    period: "2024 – Present",
    title: "NestedFusion",
    description:
      "Founded NestedFusion to bring enterprise-quality AI automation to businesses globally. Serving clients across Australia, US, MENA, and beyond.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Section>
        <div className="max-w-3xl">
          <Badge>About NestedFusion</Badge>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Building Intelligent Systems for Growing Businesses
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            NestedFusion is an AI automation consultancy founded by Hamza Abid
            Chaudhary. We specialize in workflow automation, custom GPT
            development, and full-stack solutions — helping businesses eliminate
            manual work and scale operations.
          </p>
        </div>
      </Section>

      {/* Founder */}
      <Section alt>
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div>
            <Badge>Founder</Badge>
            <h2 className="mt-4 text-3xl font-bold text-primary">
              Hamza Abid Chaudhary
            </h2>
            <p className="mt-4 leading-relaxed text-text-secondary">
              With 3+ years of experience in automation development, full-stack
              engineering, and AI integration, I&apos;ve built everything from
              compliance-critical healthcare GPTs to enterprise-scale workflow
              automations.
            </p>
            <p className="mt-4 leading-relaxed text-text-secondary">
              My time as an Automations Technician at an Australian AI
              consultancy gave me firsthand experience in multi-client project
              management, cross-functional collaboration, ethical AI
              implementation, and facilitating AI adoption training programs for
              enterprise teams.
            </p>
            <p className="mt-4 leading-relaxed text-text-secondary">
              Today, I run NestedFusion remotely from Pakistan, serving clients
              across Australia, the US, MENA, and globally — bringing
              enterprise-grade AI automation to businesses of every size.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-white p-6">
              <h3 className="font-semibold text-primary">Core Expertise</h3>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  n8n & Make.com workflow architecture
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Custom GPT & AI agent development
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Full-stack web application development
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  REST API & webhook integration design
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  AI compliance & accuracy frameworks
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <h3 className="font-semibold text-primary">Working With Me</h3>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Direct, solutions-oriented communication
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Iterative development with feedback loops
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Flexible across AU, US, EU, and MENA time zones
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Strong emphasis on debugging and reliability
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Journey */}
      <Section>
        <div className="text-center">
          <Badge>Journey</Badge>
          <h2 className="mt-4 text-3xl font-bold text-primary md:text-4xl">
            From Enterprise to Independent Consultancy
          </h2>
        </div>
        <div className="mx-auto mt-14 max-w-2xl space-y-10">
          {timeline.map((item, i) => (
            <div key={i} className="relative pl-8 border-l-2 border-border">
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-accent bg-white" />
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                {item.period}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-primary">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section alt>
        <div className="text-center">
          <Badge>Approach</Badge>
          <h2 className="mt-4 text-3xl font-bold text-primary md:text-4xl">
            How We Work
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-border bg-white p-8"
            >
              <h3 className="text-lg font-semibold text-primary">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
