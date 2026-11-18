import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RecommendationResultView } from "@/components/recommendation/RecommendationResultView";
import { RecommendationResultSkeleton } from "@/components/recommendation/RecommendationResultSkeleton";

export const metadata: Metadata = {
  title: "추천 결과",
  robots: { index: false },
};

/** URL 파라미터는 요청 시점 데이터 → Suspense 안에서 읽음 (cacheComponents) */
async function ResultLoader({ params }: { params: PageProps<"/recommendations/[id]">["params"] }) {
  const { id } = await params;
  return <RecommendationResultView id={decodeURIComponent(id)} />;
}

export default function RecommendationResultPage({ params }: PageProps<"/recommendations/[id]">) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<RecommendationResultSkeleton />}>
          <ResultLoader params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
