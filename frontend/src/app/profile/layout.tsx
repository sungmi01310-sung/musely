import type { ReactNode } from "react";
import { ProfileFormProvider } from "@/components/profile/ProfileFormProvider";
import { ProfileLayout } from "@/components/profile/ProfileLayout";

/**
 * /profile/skin, /profile/fragrance 공통 레이아웃
 * 레이아웃은 단계 이동 시 유지되므로 여기서 폼 상태(Provider)를 공유합니다.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ProfileFormProvider>
      <ProfileLayout>{children}</ProfileLayout>
    </ProfileFormProvider>
  );
}
