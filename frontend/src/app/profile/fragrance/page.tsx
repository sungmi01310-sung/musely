import type { Metadata } from "next";
import { Suspense } from "react";
import { FragranceProfileForm } from "@/components/profile/FragranceProfileForm";
import { EditModeLoader } from "@/components/profile/EditModeLoader";

export const metadata: Metadata = {
  title: "향 취향 프로필",
  description: "좋아하는 향 계열과 사용 상황을 알려주세요.",
};

export default function FragranceProfilePage() {
  return (
    <>
      <Suspense fallback={null}>
        <EditModeLoader />
      </Suspense>
      <FragranceProfileForm />
    </>
  );
}
