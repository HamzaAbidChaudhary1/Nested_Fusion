export interface Service {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  tools: string[];
  icon: string;
  image: string;
}

export const services: Service[] = [
  {
    slug: "workflow-automation",
    title: "Workflow Automation",
    tagline: "Eliminate repetitive tasks and streamline operations",
    description:
      "We design, build, and maintain complex automation workflows using n8n, Make.com, and Zapier. From multi-agent AI pipelines to webhook integrations and scheduled automations — we connect your tools so your team can focus on what matters.",
    features: [
      "n8n workflow design and self-hosted deployment",
      "Make.com scenario building with error handling",
      "Zapier integrations and troubleshooting",
      "Webhook and API-based system connections",
      "Scheduled automations and data processing pipelines",
      "Multi-step business process automation",
    ],
    tools: ["n8n", "Make.com", "Zapier", "REST APIs", "Webhooks"],
    icon: "workflow",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  },
  {
    slug: "ai-development",
    title: "AI & Custom GPT Development",
    tagline: "Purpose-built AI solutions for your domain",
    description:
      "We build custom GPTs and AI agents tailored to your specific business needs — from clinical report writing to content generation pipelines. Every solution includes compliance guardrails and accuracy frameworks.",
    features: [
      "Custom GPT development for domain-specific tasks",
      "AI-powered content generation pipelines",
      "NLP solutions and chatbot development",
      "Prompt engineering and compliance frameworks",
      "Multi-agent AI pipeline orchestration",
      "AI output quality and accuracy guardrails",
    ],
    tools: ["OpenAI GPT", "Google Gemini", "DALL-E 3", "Tavily", "Custom APIs"],
    icon: "ai",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
  },
  {
    slug: "full-stack-development",
    title: "Full-Stack Development",
    tagline: "Web apps and APIs built for integration",
    description:
      "We build web applications, APIs, and platform integrations designed to work seamlessly with your automation stack. Clean, modular code that scales with your business.",
    features: [
      "Web application development",
      "REST API and GraphQL development",
      "Database design and management",
      "CRM and platform integrations",
      "WordPress and WooCommerce development",
      "Custom dashboards and admin panels",
    ],
    tools: [
      "TypeScript",
      "Node.js",
      "Python",
      "Next.js",
      "GoHighLevel",
      "HubSpot",
    ],
    icon: "code",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
  },
  {
    slug: "ai-consulting",
    title: "AI Consulting & Training",
    tagline: "Help your team adopt AI with confidence",
    description:
      "We run AI Champions training programs and workshops to help your team adopt AI tools effectively. From strategy consulting to hands-on facilitation — we bridge the gap between AI potential and practical business impact.",
    features: [
      "AI Champions training programs",
      "Workshop facilitation for business teams",
      "AI implementation strategy consulting",
      "Curriculum development for non-technical staff",
      "Hands-on tool training and adoption support",
      "Compliance and ethical AI frameworks",
    ],
    tools: [
      "Custom training materials",
      "Live workshops",
      "AI tool ecosystems",
    ],
    icon: "consulting",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
  },
];
