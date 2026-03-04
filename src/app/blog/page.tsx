import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/section";
import Badge from "@/components/badge";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on AI automation, workflow design, and building scalable systems — from the NestedFusion team.",
};

const posts = [
  {
    slug: "why-n8n-for-business-automation",
    title: "Why n8n Is Our Go-To for Business Automation",
    excerpt:
      "A breakdown of why we choose n8n for most client projects — from self-hosting flexibility to its powerful node ecosystem.",
    date: "Coming Soon",
    category: "Automation",
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&h=400&fit=crop",
  },
  {
    slug: "building-compliance-gpts",
    title: "Building Compliance-Safe GPTs for Healthcare",
    excerpt:
      "Lessons learned from deploying 12+ custom GPTs in the disability services sector — including how we tackled evidence fabrication.",
    date: "Coming Soon",
    category: "AI Development",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
  },
  {
    slug: "automation-roi-framework",
    title: "How to Calculate ROI on Workflow Automation",
    excerpt:
      "A practical framework for measuring the real impact of automation — hours saved, errors reduced, and revenue unlocked.",
    date: "Coming Soon",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
];

export default function BlogPage() {
  return (
    <>
      <Section hero>
        <div className="max-w-3xl">
          <Badge>Blog</Badge>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Insights & Ideas
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            Practical articles on AI automation, workflow design, and building
            systems that scale. No fluff — just implementation-ready insights.
          </p>
        </div>
      </Section>

      <Section alt>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-2xl border border-border bg-white"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-medium uppercase tracking-wider text-accent">
                  {post.category}
                </span>
                <h2 className="mt-3 text-lg font-semibold text-primary">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {post.excerpt}
                </p>
                <p className="mt-4 text-xs font-medium text-text-muted">
                  {post.date}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <h2 className="text-xl font-semibold text-primary">
            More Articles Coming Soon
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary">
            We&apos;re working on in-depth articles about automation
            architecture, AI implementation, and scaling workflows. Check back
            soon.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-primary hover:bg-surface-muted transition-colors"
          >
            Get Notified
          </Link>
        </div>
      </Section>
    </>
  );
}
