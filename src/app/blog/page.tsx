"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Section from "@/components/section";
import Badge from "@/components/badge";

const posts = [
  {
    slug: "why-n8n-for-business-automation",
    title: "Why n8n Is Our Go-To for Business Automation",
    excerpt: "A breakdown of why we choose n8n for most client projects — from self-hosting flexibility to its powerful node ecosystem.",
    date: "Coming Soon",
    category: "Automation",
  },
  {
    slug: "building-compliance-gpts",
    title: "Building Compliance-Safe GPTs for Healthcare",
    excerpt: "Lessons learned from deploying 12+ custom GPTs in the disability services sector — including how we tackled evidence fabrication.",
    date: "Coming Soon",
    category: "AI Development",
  },
  {
    slug: "automation-roi-framework",
    title: "How to Calculate ROI on Workflow Automation",
    excerpt: "A practical framework for measuring the real impact of automation — hours saved, errors reduced, and revenue unlocked.",
    date: "Coming Soon",
    category: "Strategy",
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative px-6 pt-36 pb-20 md:px-12 md:pt-44 md:pb-28">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge>Blog</Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-10 font-display text-[clamp(40px,6vw,80px)] leading-[0.95] font-normal tracking-tight max-w-[700px]"
          >
            Insights & <em className="italic text-accent">ideas</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 text-[17px] leading-relaxed text-text-secondary max-w-[520px]"
          >
            Practical articles on AI automation, workflow design, and building systems that scale. No fluff — just implementation-ready insights.
          </motion.p>
        </div>
      </section>

      <Section alt>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-white p-8 shadow-card transition-all duration-400 hover:shadow-card-hover hover:border-accent/20 hover:-translate-y-1"
            >
              <span className="font-mono text-[11px] tracking-[3px] uppercase text-accent">{post.category}</span>
              <h2 className="mt-4 font-display text-xl font-normal transition-colors group-hover:text-accent">{post.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{post.excerpt}</p>
              <p className="mt-5 font-mono text-[11px] tracking-wider text-text-muted">{post.date}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-dashed border-border bg-white p-12 text-center shadow-card">
          <h2 className="font-display text-2xl font-normal">More articles coming soon</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary">
            We&apos;re working on in-depth articles about automation architecture, AI implementation, and scaling workflows. Check back soon.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block text-[13px] font-medium text-text-primary px-6 py-2.5 border border-border rounded-full transition-all duration-300 hover:border-border-light hover:shadow-card"
          >
            Get Notified
          </Link>
        </div>
      </Section>
    </>
  );
}
