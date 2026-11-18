"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** 앱 전역 클라이언트 프로바이더 — OS의 '동작 줄이기' 설정을 모든 모션에 반영 */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
