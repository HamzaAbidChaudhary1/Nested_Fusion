# CLAUDE.md — NestedFusion Website

## Project Overview

NestedFusion company website — an AI automation consultancy founded by Hamza Abid Chaudhary. Built with Next.js, Tailwind CSS v4, and Framer Motion.

**Tagline:** "Scale Your Business by Analyzing Every Step"

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 with `@tailwindcss/postcss`
- **Animations:** Framer Motion
- **Build:** Turbopack (via Next.js)
- **Package Manager:** npm

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (Navbar + Footer)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles + Tailwind theme
│   ├── about/page.tsx      # About page
│   ├── services/page.tsx   # Services page
│   ├── case-studies/page.tsx # Case Studies page
│   ├── blog/page.tsx       # Blog page
│   └── contact/page.tsx    # Contact page
├── components/             # Reusable components
│   ├── navbar.tsx          # Sticky navigation with mobile menu
│   ├── footer.tsx          # Site footer
│   ├── section.tsx         # Animated section wrapper
│   ├── badge.tsx           # Small label badge
│   └── contact-form.tsx    # Contact form (client component)
├── data/                   # Static data
│   ├── services.ts         # Service definitions
│   └── case-studies.ts     # Case study content
└── lib/                    # Utilities (currently empty)
```

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Design System

The theme is defined in `src/app/globals.css` using Tailwind v4's `@theme` directive:

- **Design:** Clean, minimal, light background
- **Primary color:** Slate-900 (`#0f172a`)
- **Accent color:** Blue-600 (`#2563eb`)
- **Font:** Inter (Google Fonts)
- **Surfaces:** White (`#ffffff`), light gray (`#f8fafc`)

Custom color tokens: `primary`, `accent`, `surface`, `surface-alt`, `surface-muted`, `text`, `text-secondary`, `text-muted`, `border`, `border-light`.

## Key Conventions

- Pages that need Framer Motion use `"use client"` directive
- Server components are default (About, Services, Blog, Contact metadata)
- The `Section` component provides consistent padding and scroll-triggered fade-in animation
- Data files in `src/data/` define services and case studies — edit these to update content
- The contact form (`contact-form.tsx`) has a `TODO` for backend/email service integration
- All pages follow the pattern: Hero section → Content sections → CTA section

## Content Updates

- **Services:** Edit `src/data/services.ts`
- **Case Studies:** Edit `src/data/case-studies.ts`
- **Blog Posts:** Edit the `posts` array in `src/app/blog/page.tsx`
- **Contact Info:** Edit the `contactInfo` array in `src/app/contact/page.tsx`
- **Navigation:** Edit `navLinks` in `src/components/navbar.tsx`

## Notes for AI Assistants

- This is a consultancy website — keep copy concise and professional
- Prioritize n8n and Make.com references in service descriptions
- Maintain the clean/minimal design aesthetic (no dark themes unless requested)
- The site uses Tailwind CSS v4 syntax — theme config is in CSS (`@theme`), not `tailwind.config.js`
- When adding new pages, follow the existing Section/Badge/motion pattern
- Keep client components (`"use client"`) minimal — only where interactivity is needed
