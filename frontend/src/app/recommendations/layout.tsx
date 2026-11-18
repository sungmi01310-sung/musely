import type { ReactNode } from "react";
import { MockScenarioSwitcher } from "@/components/recommendation/MockScenarioSwitcher";

/** /recommendations/* 공통 — 개발용 Mock 시나리오 패널(Mock 어댑터일 때만 표시) */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <MockScenarioSwitcher />
    </>
  );
}
