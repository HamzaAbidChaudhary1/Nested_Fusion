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
      <Section>
        <div className="max-w-3xl">
          <Badge>Case Studies</Badge>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Real Solutions, Measurable Results
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            Every project starts with a business problem and ends with a working
            system. Here are some of the automation and AI solutions we&apos;ve
            delivered.
          </p>
        </div>
      </Section>

      {/* Case study cards */}
      <Section alt>
        <div className="space-y-8">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              id={study.slug}
              className="rounded-2xl border border-border bg-white p-8 md:p-10"
            >
              <div className="grid gap-8 md:grid-cols-3">
                {/* Left: overview */}
                <div className="md:col-span-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-accent">
                    {study.sector}
                  </span>
                  <h2 className="mt-2 text-2xl font-bold text-primary">
                    {study.title}
                  </h2>

                  <div className="mt-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                      Challenge
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {study.challenge}
                    </p>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                      Solution
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {study.solution}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {study.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-secondary"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: results */}
                <div className="rounded-xl bg-surface-alt p-6">
                  <div className="mb-4 rounded-lg bg-accent/10 px-4 py-3">
                    <p className="text-sm font-semibold text-accent">
                      {study.highlight}
                    </p>
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                    Results
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {study.results.map((result) => (
                      <li
                        key={result}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Want Results Like These?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            Let&apos;s discuss your project and see how automation and AI can
            drive real impact for your business.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Start a Project
          </Link>
        </div>
      </Section>
    </>
  );
}
