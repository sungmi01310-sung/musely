import type { Metadata } from "next";
import { Suspense } from "react";
import { SkinProfileForm } from "@/components/profile/SkinProfileForm";
import { EditModeLoader } from "@/components/profile/EditModeLoader";

export const metadata: Metadata = {
  title: "피부 프로필",
  description: "피부 타입과 고민, 피하고 싶은 성분, 사용 중인 성분을 알려주세요.",
};

export default function SkinProfilePage() {
  return (
    <>
      <Suspense fallback={null}>
        <EditModeLoader />
      </Suspense>
      <SkinProfileForm />
    </>
  );
}
