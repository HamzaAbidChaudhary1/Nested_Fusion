"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Section from "@/components/section";
import Badge from "@/components/badge";
import { services } from "@/data/services";

const process = [
  { step: "01", title: "Discovery", description: "We map out your current workflows, identify bottlenecks, and define what success looks like for your automation project." },
  { step: "02", title: "Design", description: "We architect the solution — choosing the right tools, designing integrations, and planning the implementation roadmap." },
  { step: "03", title: "Build", description: "We develop and test the automation system iteratively, with regular check-ins to ensure everything aligns with your needs." },
  { step: "04", title: "Deploy & Support", description: "We launch the solution, monitor for issues, and provide ongoing support to keep everything running smoothly." },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative px-6 pt-36 pb-20 md:px-12 md:pt-44 md:pb-28">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge>Services</Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-10 font-display text-[clamp(40px,6vw,80px)] leading-[0.95] font-normal tracking-tight max-w-[800px]"
          >
            Automation, AI, and development — <em className="italic text-accent">built to scale</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 text-[17px] leading-relaxed text-text-secondary max-w-[560px]"
          >
            We offer a full range of automation and development services. Whether you need a single workflow or an enterprise-wide AI integration, we have the expertise to deliver.
          </motion.p>
        </div>
      </section>

      {/* Service details */}
      {services.map((service, i) => (
        <Section key={service.slug} id={service.slug} alt={i % 2 !== 0}>
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="font-mono text-[11px] tracking-[4px] uppercase text-accent mb-5">{service.title}</div>
              <h2 className="font-display text-[clamp(28px,3vw,42px)] leading-[1.1] mb-3">{service.title}</h2>
              <p className="text-accent-dim font-medium text-[15px] mb-5">{service.tagline}</p>
              <p className="text-[15px] leading-relaxed text-text-secondary mb-6">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tools.map((tool) => (
                  <span key={tool} className="font-mono text-[11px] tracking-wider text-accent-dim px-3 py-1.5 border border-accent/12 rounded-full bg-accent/4">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
              <h3 className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-5">What&apos;s Included</h3>
              <ul className="space-y-3.5">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ))}

      {/* Process */}
      <Section>
        <div className="text-center mb-16">
          <div className="font-mono text-[11px] tracking-[4px] uppercase text-accent mb-5">Process</div>
          <h2 className="font-display text-[clamp(32px,3.5vw,48px)] leading-[1.1]">How we work together</h2>
          <p className="mx-auto mt-4 max-w-lg text-text-secondary text-[15px]">
            A straightforward, iterative process designed to get you from idea to working system as quickly as possible.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {process.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-border p-10 shadow-card transition-all duration-400 hover:shadow-card-hover group"
            >
              <div className="font-display text-[56px] text-border leading-none mb-5 transition-colors duration-400 group-hover:text-accent">
                {item.step}
              </div>
              <h3 className="text-base font-semibold mb-2">{item.title}</h3>
              <p className="text-[13px] leading-relaxed text-text-secondary">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section alt>
        <div className="relative text-center py-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_60%)] pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[1.1] mb-6">
              Have a project in <em className="italic text-accent">mind</em>?
            </h2>
            <p className="text-[15px] text-text-secondary max-w-lg mx-auto leading-relaxed mb-8">
              Let&apos;s talk about how we can automate your workflows, build custom AI tools, or develop the platform you need.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-accent text-white text-[15px] font-semibold rounded-full shadow-button transition-all duration-300 hover:shadow-button-hover hover:-translate-y-0.5"
            >
              Start a Conversation
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
