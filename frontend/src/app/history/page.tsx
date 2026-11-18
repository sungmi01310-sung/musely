import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HistoryView } from "@/components/history/HistoryView";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "추천 기록",
  description: "지금까지 발견한 나만의 뷰티 레이어를 다시 만나보세요.",
};

export default function HistoryPage() {
  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden pb-28">
        <div aria-hidden className="pointer-events-none absolute -right-40 top-40 size-[520px] rounded-full bg-lavender blur-[120px]" />
        <Container className="relative max-w-[1180px] pt-12 sm:pt-20">
          <PageHero
            en="Your Beauty Archive"
            title="나를 위한 추천 기록"
            description="지금까지 발견한 나만의 뷰티 레이어를 다시 만나보세요."
            aside={
              <Button href={routes.recommendationStart} variant="secondary" arrow>
                새 추천 받기
              </Button>
            }
          />
          <Suspense fallback={null}>
            <HistoryView />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </>
  );
}
