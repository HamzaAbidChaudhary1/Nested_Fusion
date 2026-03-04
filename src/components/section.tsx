"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  alt?: boolean;
  hero?: boolean;
}

export default function Section({
  children,
  className = "",
  id,
  alt = false,
  hero = false,
}: SectionProps) {
  const padding = hero
    ? "px-6 pt-20 pb-20 md:pt-32 md:pb-28"
    : "px-6 py-20 md:py-28";

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${padding} ${alt ? "bg-surface-alt" : "bg-surface"} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </motion.section>
  );
}
