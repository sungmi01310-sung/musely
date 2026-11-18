import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { MockNotice } from "@/components/recommendation/MockNotice";
import { RecommendationRunner, RecommendationRunnerFallback } from "@/components/recommendation/RecommendationRunner";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "추천 진행 중",
  robots: { index: false },
};

export default function RecommendationLoadingPage() {
  return (
    <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden">
      {/* 부드럽게 번지는 배경 빛 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-[-10%] size-[520px] rounded-full bg-lavender blur-[120px]" />
        <div className="absolute -right-32 bottom-[-15%] size-[460px] rounded-full bg-rose/45 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 size-[300px] -translate-x-1/2 rounded-full bg-sage/15 blur-[100px]" />
      </div>

      <header className="relative z-10 flex h-16 items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
        <Logo />
        <Link
          href={routes.recommendationSelect}
          className="-mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] text-muted transition-colors hover:text-charcoal"
        >
          <X className="size-3.5" strokeWidth={1.5} aria-hidden />
          나가기
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 pb-28 pt-4 sm:px-8 sm:pt-8">
        <Suspense fallback={<RecommendationRunnerFallback />}>
          <RecommendationRunner />
        </Suspense>
      </main>

      <MockNotice className="absolute inset-x-0 bottom-6 z-10 mx-auto w-fit max-w-[calc(100%-2rem)] max-sm:bottom-20" />
    </div>
  );
}
