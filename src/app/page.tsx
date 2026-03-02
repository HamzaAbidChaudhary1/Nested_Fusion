"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Section from "@/components/section";
import Badge from "@/components/badge";
import { services } from "@/data/services";
import { caseStudies } from "@/data/case-studies";

const stats = [
  { value: "3+", label: "Years Experience" },
  { value: "12+", label: "Custom GPTs Built" },
  { value: "50%", label: "Time Saved for Clients" },
  { value: "4+", label: "Countries Served" },
];

const sectors = [
  "Healthcare",
  "Real Estate",
  "Education",
  "Publishing",
  "E-commerce",
  "Professional Services",
  "Recruitment & HR",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface px-6 pt-20 pb-28 md:pt-32 md:pb-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-accent)/5%,_transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge>AI Automation Consultancy</Badge>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-primary md:text-6xl md:leading-[1.1]">
              Scale Your Business by{" "}
              <span className="text-accent">Analyzing Every Step</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
              We build intelligent automation systems, custom AI solutions, and
              full-stack applications that eliminate manual work and unlock
              growth. From n8n workflows to custom GPTs — we handle the
              complexity so you don&apos;t have to.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
              >
                Start a Project
              </Link>
              <Link
                href="/case-studies"
                className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-surface-muted"
              >
                View Case Studies
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-white p-6 text-center"
              >
                <div className="text-3xl font-bold text-accent">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services overview */}
      <Section alt>
        <div className="text-center">
          <Badge>What We Do</Badge>
          <h2 className="mt-4 text-3xl font-bold text-primary md:text-4xl">
            End-to-End Automation Solutions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            From workflow automation to custom AI development — we deliver
            solutions that connect your tools, reduce manual effort, and drive
            measurable ROI.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {services.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/services#${service.slug}`}
                className="group block rounded-2xl border border-border bg-white p-8 transition-shadow hover:shadow-lg"
              >
                <div className="text-3xl">{service.icon}</div>
                <h3 className="mt-4 text-xl font-semibold text-primary group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {service.tagline}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.tools.slice(0, 3).map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs text-text-muted"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="text-sm font-medium text-accent hover:text-accent-dark transition-colors"
          >
            Explore all services →
          </Link>
        </div>
      </Section>

      {/* Featured case studies */}
      <Section>
        <div className="text-center">
          <Badge>Results</Badge>
          <h2 className="mt-4 text-3xl font-bold text-primary md:text-4xl">
            Projects That Deliver Impact
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Real solutions for real businesses. Here&apos;s a look at some of the
            automation systems and AI tools we&apos;ve built.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {caseStudies.slice(0, 3).map((study, i) => (
            <motion.div
              key={study.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-white p-8"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                {study.sector}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-primary">
                {study.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {study.challenge.slice(0, 120)}...
              </p>
              <div className="mt-4 rounded-lg bg-accent/5 px-4 py-3">
                <p className="text-sm font-medium text-accent">
                  {study.highlight}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/case-studies"
            className="text-sm font-medium text-accent hover:text-accent-dark transition-colors"
          >
            View all case studies →
          </Link>
        </div>
      </Section>

      {/* Sectors */}
      <Section alt>
        <div className="text-center">
          <Badge>Industries</Badge>
          <h2 className="mt-4 text-3xl font-bold text-primary md:text-4xl">
            Trusted Across Sectors
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            We work with businesses in healthcare, real estate, education, and
            more — delivering automation solutions tailored to each industry.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {sectors.map((sector) => (
            <span
              key={sector}
              className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-text-secondary"
            >
              {sector}
            </span>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="rounded-2xl bg-primary px-8 py-16 text-center md:px-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to Automate?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Let&apos;s discuss how automation and AI can eliminate bottlenecks,
            reduce costs, and scale your operations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
            >
              Get in Touch
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              View Services
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
