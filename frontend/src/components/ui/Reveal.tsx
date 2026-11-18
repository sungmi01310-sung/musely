"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & {
  /** 렌더링할 태그 (리스트 안에서는 "li") */
  as?: "div" | "li";
  delay?: number;
  /** 아래에서 떠오르는 거리(px) */
  y?: number;
};

/** 뷰포트에 들어올 때 부드럽게 나타나는 래퍼 */
export function Reveal({ as = "div", delay = 0, y = 28, children, ...props }: RevealProps) {
  const reduce = useReducedMotion();
  const Component = (as === "li" ? motion.li : motion.div) as typeof motion.div;
  return (
    <Component
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </Component>
  );
}
