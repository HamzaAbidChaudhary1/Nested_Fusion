interface BadgeProps {
  children: React.ReactNode;
}

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-bg-card border border-border px-4 py-2 text-xs font-medium text-text-secondary tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
      {children}
    </span>
  );
}
