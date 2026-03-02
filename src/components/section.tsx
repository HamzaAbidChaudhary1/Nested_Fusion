"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  alt?: boolean;
}

export default function Section({
  children,
  className = "",
  id,
  alt = false,
}: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`px-6 py-20 md:py-28 ${alt ? "bg-surface-alt" : "bg-surface"} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </motion.section>
  );
}
