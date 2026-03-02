import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/section";
import Badge from "@/components/badge";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with NestedFusion. Let's discuss your automation, AI, or development project.",
};

const contactInfo = [
  {
    label: "Email",
    value: "hello@nestedfusion.com",
    href: "mailto:hello@nestedfusion.com",
  },
  {
    label: "Location",
    value: "Pakistan (Remote — Serving Globally)",
    href: null,
  },
  {
    label: "Time Zone",
    value: "PKT (UTC+5) — Flexible across AU, US, EU, MENA",
    href: null,
  },
  {
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <Section>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Badge>Contact</Badge>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              Let&apos;s Build Something Together
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-text-secondary">
              Have a project in mind? Need help with automation or AI? Send me a
              message and I&apos;ll get back to you within 24 hours.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&h=600&fit=crop"
              alt="Getting in touch"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section alt>
        <div className="grid gap-12 md:grid-cols-5">
          {/* Form */}
          <div className="md:col-span-3">
            <h2 className="text-2xl font-bold text-primary">Send a Message</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Fill out the form and I&apos;ll get back to you as soon as
              possible.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          {/* Contact info */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-primary">Get in Touch</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Prefer a direct conversation? Reach out through any of these
              channels.
            </p>
            <div className="mt-8 space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    {info.label}
                  </h3>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="mt-1 block text-sm font-medium text-primary hover:text-accent transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-primary">
                      {info.value}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-border bg-white p-6">
              <h3 className="font-semibold text-primary">What to Expect</h3>
              <ul className="mt-4 space-y-3 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Reply within 24 hours
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Free initial consultation call
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Detailed proposal with scope and timeline
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  No obligation — just a conversation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
