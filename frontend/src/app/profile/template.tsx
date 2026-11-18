"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/** STEP 1 ↔ STEP 2 전환 애니메이션 (과하지 않게 살짝 밀려 들어옴) */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
