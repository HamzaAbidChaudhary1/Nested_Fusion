import Link from "next/link";

const footerLinks = [
  { href: "https://linkedin.com/in/hamzaabidchaudhary", label: "LinkedIn", external: true },
  { href: "https://twitter.com", label: "Twitter", external: true },
  { href: "mailto:hamza@nestedfusion.com", label: "Email", external: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="font-mono text-xs text-text-muted tracking-widest">
          &copy; {new Date().getFullYear()} NESTEDFUSION
        </div>
        <div className="flex gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-[13px] text-text-secondary hover:text-accent transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
