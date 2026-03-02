export interface CaseStudy {
  slug: string;
  title: string;
  sector: string;
  challenge: string;
  solution: string;
  results: string[];
  tools: string[];
  highlight: string;
  image: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "healthcare-compliance-gpts",
    title: "Healthcare Compliance GPTs",
    sector: "Healthcare",
    challenge:
      "Clinical practitioners in the disability services sector were spending 5+ hours writing each compliance report, with risks of evidence fabrication in AI-assisted outputs.",
    solution:
      "Built 12+ custom GPTs with structured prompting frameworks and compliance guardrails, ensuring clinical accuracy while dramatically reducing report creation time.",
    results: [
      "Report creation time reduced from 5+ hours to ~2.5 hours",
      "12+ custom GPTs deployed for clinical use",
      "Eliminated evidence fabrication risks with guardrails",
      "NDIS compliance standards maintained across all outputs",
    ],
    tools: ["Custom GPTs", "OpenAI API", "Compliance Frameworks"],
    highlight: "50% reduction in report creation time",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop",
  },
  {
    slug: "real-estate-booking-system",
    title: "Real Estate Booking System",
    sector: "Real Estate",
    challenge:
      "A property investment firm needed a comprehensive booking and client onboarding system with payment processing and CRM integration.",
    solution:
      "Built a multi-step booking form with conditional logic, integrated GoHighLevel CRM, and automated the entire client onboarding workflow including payment processing.",
    results: [
      "Fully automated booking-to-onboarding pipeline",
      "Payment processing integrated into booking flow",
      "GoHighLevel CRM synced in real-time",
      "Complex conditional logic for investment workflows",
    ],
    tools: ["GoHighLevel", "Webhooks", "Payment APIs", "n8n"],
    highlight: "End-to-end automated client onboarding",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
  },
  {
    slug: "cv-builder-auto-replier",
    title: "Automated CV Builder & Recruiter Auto-Replier",
    sector: "Recruitment & HR",
    challenge:
      "Job seekers needed a way to quickly generate tailored CVs and respond to recruiter messages without spending hours on each application.",
    solution:
      "Built an AI-powered CV generation system that tailors resumes to job descriptions, paired with an automated recruiter message parser that generates intelligent, personalized replies.",
    results: [
      "Automated CV generation tailored to job descriptions",
      "Intelligent recruiter message parsing and reply generation",
      "Job matching logic with customizable templates",
      "End-to-end pipeline from job listing to application",
    ],
    tools: ["OpenAI API", "n8n", "Custom Templates", "Email APIs"],
    highlight: "Full application pipeline automated",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=500&fit=crop",
  },
  {
    slug: "ecommerce-automation",
    title: "E-commerce Automation Suite",
    sector: "E-commerce",
    challenge:
      "An online retailer struggled with manual inventory management, inconsistent product listings across channels, and slow order processing.",
    solution:
      "Developed a comprehensive automation suite handling product synchronization, inventory management, customer journey automation, and order fulfillment workflows.",
    results: [
      "Product listings synced across all sales channels",
      "Automated inventory tracking and restocking alerts",
      "Personalized customer follow-up sequences",
      "Order processing and fulfillment automated",
    ],
    tools: ["Make.com", "WooCommerce", "REST APIs", "Webhooks"],
    highlight: "Multi-channel operations fully automated",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
  },
  {
    slug: "social-media-pipeline",
    title: "Social Media Content Pipeline",
    sector: "Publishing",
    challenge:
      "A publishing company needed to produce consistent, high-quality content across multiple platforms without increasing headcount.",
    solution:
      "Built an AI-powered content pipeline that handles ideation, generation, scheduling, publishing, and performance tracking across multiple social media platforms.",
    results: [
      "AI-powered content ideation and generation",
      "Multi-platform scheduling and publishing automated",
      "Engagement tracking with automated responses",
      "Performance analytics aggregated into dashboards",
    ],
    tools: ["OpenAI API", "Make.com", "Social APIs", "Airtable"],
    highlight: "Content production scaled without new hires",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=500&fit=crop",
  },
  {
    slug: "client-onboarding-automation",
    title: "Client Onboarding Automation",
    sector: "Professional Services",
    challenge:
      "A service-based business had a manual, error-prone onboarding process that led to delays and inconsistent client experiences.",
    solution:
      "Automated the entire onboarding flow — from intake forms with conditional logic to document collection, CRM record creation, team notifications, and personalized welcome sequences.",
    results: [
      "Multi-step intake forms with conditional logic",
      "Automated document collection and verification",
      "CRM records and team notifications automated",
      "Personalized welcome sequences for every client",
    ],
    tools: ["n8n", "GoHighLevel", "Google Workspace", "Webhooks"],
    highlight: "Zero-touch client onboarding achieved",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop",
  },
];
