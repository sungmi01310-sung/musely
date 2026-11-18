import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SettingsView } from "@/components/settings/SettingsView";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "내 정보와 취향을 관리하고, 더 나에게 맞는 추천을 받아보세요.",
};

export default function SettingsPage() {
  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden pb-28">
        <div aria-hidden className="pointer-events-none absolute -left-40 top-40 size-[520px] rounded-full bg-rose/35 blur-[120px]" />
        <Container className="relative max-w-[1180px] pt-12 sm:pt-20">
          <PageHero
            en="My Beauty Space"
            title="나만의 뷰티 공간"
            description="내 정보와 취향을 관리하고, 더 나에게 맞는 추천을 받아보세요."
          />
          <SettingsView />
        </Container>
      </main>
      <Footer />
    </>
  );
}
