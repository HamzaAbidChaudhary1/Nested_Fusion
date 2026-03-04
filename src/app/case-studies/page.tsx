"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Section from "@/components/section";
import Badge from "@/components/badge";
import { caseStudies } from "@/data/case-studies";

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative px-6 pt-36 pb-20 md:px-12 md:pt-44 md:pb-28">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(37,99,235,0.04)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge>Case Studies</Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-10 font-display text-[clamp(40px,6vw,80px)] leading-[0.95] font-normal tracking-tight max-w-[800px]"
          >
            Real solutions, <em className="italic text-accent">measurable</em> results
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 text-lg leading-relaxed text-text-secondary max-w-[560px]"
          >
            Every project starts with a business problem and ends with a working system. Here are some of the automation and AI solutions we&apos;ve delivered.
          </motion.p>
        </div>
      </section>

      {/* Case study cards */}
      <Section alt>
        <div className="space-y-6">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              id={study.slug}
              className="rounded-2xl border border-border bg-bg-card overflow-hidden transition-all duration-400 hover:border-border-light"
            >
              <div className="p-8 md:p-10">
                <div className="grid gap-10 lg:grid-cols-5">
                  {/* Left: overview */}
                  <div className="lg:col-span-3">
                    <span className="font-mono text-[11px] tracking-[3px] uppercase text-accent">{study.sector}</span>
                    <h2 className="mt-3 font-display text-2xl font-normal">{study.title}</h2>

                    <div className="mt-7">
                      <h3 className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-2">Challenge</h3>
                      <p className="text-sm leading-relaxed text-text-secondary">{study.challenge}</p>
                    </div>

                    <div className="mt-5">
                      <h3 className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-2">Solution</h3>
                      <p className="text-sm leading-relaxed text-text-secondary">{study.solution}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {study.tools.map((tool) => (
                        <span key={tool} className="font-mono text-[11px] tracking-wider text-accent-dim px-3 py-1 border border-accent/12 rounded-full">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: results */}
                  <div className="lg:col-span-2">
                    <div className="rounded-xl bg-bg-secondary border border-border p-6">
                      <div className="mb-5 rounded-lg bg-accent/8 border border-accent/15 px-4 py-3">
                        <p className="text-sm font-semibold text-accent">{study.highlight}</p>
                      </div>
                      <h3 className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-3">Results</h3>
                      <ul className="space-y-2.5">
                        {study.results.map((result) => (
                          <li key={result} className="flex items-start gap-2.5 text-sm text-text-secondary">
                            <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="relative text-center py-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[radial-gradient(circle,rgba(37,99,235,0.05)_0%,transparent_60%)] pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-[clamp(32px,4vw,56px)] leading-[1.1] mb-6">
              Want results like <em className="italic text-accent">these</em>?
            </h2>
            <p className="text-[15px] text-text-secondary max-w-lg mx-auto leading-relaxed mb-8">
              Let&apos;s discuss your project and see how automation and AI can drive real impact for your business.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-accent text-white text-[15px] font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(37,99,235,0.2)] hover:-translate-y-0.5"
            >
              Start a Project
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
