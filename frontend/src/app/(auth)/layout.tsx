import type { ReactNode } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";

/** /login, /signup 공통 레이아웃 — 메인 Header/Footer 대신 인증 전용 2단 레이아웃 */
export default function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
