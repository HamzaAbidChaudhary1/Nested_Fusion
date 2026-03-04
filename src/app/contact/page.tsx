"use client";

import { motion } from "framer-motion";
import Section from "@/components/section";
import Badge from "@/components/badge";
import ContactForm from "@/components/contact-form";

const contactInfo = [
  { label: "Email", value: "hello@nestedfusion.com", href: "mailto:hello@nestedfusion.com" },
  { label: "Location", value: "Pakistan (Remote \u2014 Serving Globally)", href: null },
  { label: "Time Zone", value: "PKT (UTC+5) \u2014 Flexible across AU, US, EU, MENA", href: null },
  { label: "Response Time", value: "Within 24 hours", href: null },
];

const expectations = [
  "Reply within 24 hours",
  "Free initial consultation call",
  "Detailed proposal with scope and timeline",
  "No obligation \u2014 just a conversation",
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative px-6 pt-36 pb-20 md:px-12 md:pt-44 md:pb-28">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(37,99,235,0.04)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge>Contact</Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-10 font-display text-[clamp(40px,6vw,80px)] leading-[0.95] font-normal tracking-tight max-w-[700px]"
          >
            Let&apos;s build something <em className="italic text-accent">together</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 text-lg leading-relaxed text-text-secondary max-w-[520px]"
          >
            Have a project in mind? Need help with automation or AI? Send me a message and I&apos;ll get back to you within 24 hours.
          </motion.p>
        </div>
      </section>

      <Section alt>
        <div className="grid gap-16 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-2xl font-normal mb-2">Send a message</h2>
            <p className="text-sm text-text-secondary mb-8">
              Fill out the form and I&apos;ll get back to you as soon as possible.
            </p>
            <ContactForm />
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-normal mb-2">Get in touch</h2>
            <p className="text-sm text-text-secondary mb-8">
              Prefer a direct conversation? Reach out through any of these channels.
            </p>
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label}>
                  <h3 className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-1">{info.label}</h3>
                  {info.href ? (
                    <a href={info.href} className="text-sm font-medium text-text-primary hover:text-accent transition-colors duration-300">
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-text-primary">{info.value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-border bg-bg-card p-7">
              <h3 className="text-base font-semibold mb-4">What to Expect</h3>
              <ul className="space-y-3">
                {expectations.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
