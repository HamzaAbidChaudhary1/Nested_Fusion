"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Connect to backend/email service
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border bg-bg-card p-10 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
          <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-semibold text-text-primary">
          Message Sent
        </h3>
        <p className="mt-2 text-text-secondary">
          Thanks for reaching out. I&apos;ll get back to you within 24 hours.
        </p>
      </motion.div>
    );
  }

  const inputClasses =
    "w-full rounded-xl border border-border bg-bg-card px-4 py-3 text-sm text-text-primary outline-none transition-all duration-300 focus:border-accent/50 focus:ring-2 focus:ring-accent/10 placeholder:text-text-muted";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-primary">
            Name
          </label>
          <input type="text" id="name" name="name" required className={inputClasses} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-primary">
            Email
          </label>
          <input type="email" id="email" name="email" required className={inputClasses} placeholder="you@company.com" />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-text-primary">
          Subject
        </label>
        <select id="subject" name="subject" required className={inputClasses}>
          <option value="">Select a topic</option>
          <option value="automation">Workflow Automation</option>
          <option value="ai">AI / Custom GPT Development</option>
          <option value="development">Full-Stack Development</option>
          <option value="consulting">AI Consulting & Training</option>
          <option value="other">Something Else</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text-primary">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={`${inputClasses} resize-none`}
          placeholder="Tell me about your project..."
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(37,99,235,0.2),0_0_80px_rgba(37,99,235,0.06)] hover:-translate-y-0.5"
      >
        Send Message
      </button>
    </form>
  );
}
