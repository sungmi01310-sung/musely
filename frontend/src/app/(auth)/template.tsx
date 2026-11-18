"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/** 로그인 ↔ 회원가입 이동 시 폼 영역이 부드럽게 전환되도록 하는 템플릿 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
