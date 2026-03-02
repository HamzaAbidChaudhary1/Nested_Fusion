import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Company: [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  Services: [
    { href: "/services#workflow-automation", label: "Workflow Automation" },
    { href: "/services#ai-development", label: "AI Development" },
    { href: "/services#full-stack-development", label: "Full-Stack Development" },
    { href: "/services#ai-consulting", label: "AI Consulting" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center">
              <Image src="/logo.svg" alt="Nested Fusion" width={150} height={38} />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
              AI automation consultancy helping businesses scale through
              intelligent workflow automation, custom AI solutions, and
              full-stack development.
            </p>
            <p className="mt-4 text-sm text-text-muted">
              Based in Pakistan, serving clients globally.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-primary">{heading}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} NestedFusion. All rights reserved.
          </p>
          <p className="text-sm text-text-muted">
            Built by{" "}
            <span className="text-text-secondary">Hamza Abid Chaudhary</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
