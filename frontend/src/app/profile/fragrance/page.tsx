import type { Metadata } from "next";
import { FragranceProfileForm } from "@/components/profile/FragranceProfileForm";

export const metadata: Metadata = {
  title: "향 취향 프로필",
  description: "좋아하는 향 계열과 사용 상황을 알려주세요.",
};

export default function FragranceProfilePage() {
  return <FragranceProfileForm />;
}
