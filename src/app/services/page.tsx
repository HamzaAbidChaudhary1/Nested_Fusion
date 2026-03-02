import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/section";
import Badge from "@/components/badge";
import ServiceIcon from "@/components/service-icon";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Workflow automation, AI development, full-stack engineering, and AI consulting. Explore what NestedFusion can build for your business.",
};

const process = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We map out your current workflows, identify bottlenecks, and define what success looks like for your automation project.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "We architect the solution — choosing the right tools, designing integrations, and planning the implementation roadmap.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "We develop and test the automation system iteratively, with regular check-ins to ensure everything aligns with your needs.",
  },
  {
    step: "04",
    title: "Deploy & Support",
    description:
      "We launch the solution, monitor for issues, and provide ongoing support to keep everything running smoothly.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <Section>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Badge>Services</Badge>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              Automation, AI, and Development — Built to Scale
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-text-secondary">
              We offer a full range of automation and development services. Whether
              you need a single workflow or an enterprise-wide AI integration, we
              have the expertise to deliver.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop"
              alt="Team working on automation solutions"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Service details */}
      {services.map((service, i) => (
        <Section key={service.slug} id={service.slug} alt={i % 2 !== 0}>
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div>
              <ServiceIcon name={service.icon} className="h-12 w-12" />
              <h2 className="mt-4 text-3xl font-bold text-primary">
                {service.title}
              </h2>
              <p className="mt-2 text-lg text-accent font-medium">
                {service.tagline}
              </p>
              <p className="mt-4 leading-relaxed text-text-secondary">
                {service.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {service.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-text-secondary"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="relative aspect-video overflow-hidden rounded-2xl">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="rounded-2xl border border-border bg-white p-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                  What&apos;s Included
                </h3>
                <ul className="mt-4 space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-text-secondary"
                    >
                      <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Section>
      ))}

      {/* Process */}
      <Section>
        <div className="text-center">
          <Badge>Process</Badge>
          <h2 className="mt-4 text-3xl font-bold text-primary md:text-4xl">
            How We Work Together
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            A straightforward, iterative process designed to get you from idea to
            working system as quickly as possible.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {process.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-border bg-white p-6"
            >
              <span className="text-2xl font-bold text-accent/30">
                {item.step}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-primary">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section alt>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">
            Have a Project in Mind?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            Let&apos;s talk about how we can automate your workflows, build
            custom AI tools, or develop the platform you need.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Start a Conversation
          </Link>
        </div>
      </Section>
    </>
  );
}
