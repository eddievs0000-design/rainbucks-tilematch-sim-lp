import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import rainbucksLogo from "@/assets/rainbucks-logo";

export function LogoPill() {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl bg-card px-3 py-2 shadow-sm">
      <img src={rainbucksLogo} alt="Rainbucks logo" className="h-7 w-auto" />
    </div>
  );
}

export function SectionFade({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function StarRow({ size = 14 }: { size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#FF7EC8">
          <path d="M12 .587l3.668 7.568L24 9.75l-6 5.857L19.336 24 12 19.897 4.664 24 6 15.607 0 9.75l8.332-1.595z" />
        </svg>
      ))}
    </div>
  );
}
