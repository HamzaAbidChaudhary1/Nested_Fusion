interface ServiceIconProps {
  name: string;
  className?: string;
}

export default function ServiceIcon({ name, className = "h-10 w-10" }: ServiceIconProps) {
  const icons: Record<string, React.ReactNode> = {
    workflow: (
      <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#2563eb" fillOpacity="0.1" />
        <path d="M12 14h4v4h-4zM24 14h4v4h-4zM18 22h4v4h-4z" fill="#2563eb" />
        <path d="M16 16l4 6M24 16l-4 6" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    ai: (
      <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#2563eb" fillOpacity="0.1" />
        <circle cx="20" cy="20" r="7" stroke="#2563eb" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="2.5" fill="#2563eb" />
        <path d="M20 9v4M20 27v4M9 20h4M27 20h4M12.5 12.5l2.8 2.8M24.7 24.7l2.8 2.8M27.5 12.5l-2.8 2.8M15.3 24.7l-2.8 2.8" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    code: (
      <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#2563eb" fillOpacity="0.1" />
        <path d="M15 14l-5 6 5 6M25 14l5 6-5 6" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 12l-4 16" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    consulting: (
      <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#2563eb" fillOpacity="0.1" />
        <path d="M14 28V18l6-5 6 5v10" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 28v-5h4v5" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 18l10-8 10 8" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return <>{icons[name] || icons.workflow}</>;
}
