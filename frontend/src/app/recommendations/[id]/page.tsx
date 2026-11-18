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
async function ResultLoader({
  params,
  searchParams,
}: {
  params: PageProps<"/recommendations/[id]">["params"];
  searchParams: PageProps<"/recommendations/[id]">["searchParams"];
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  // 히스토리에서 들어온 경우: 저장된 결과만 보여주고, 돌아가기 링크를 히스토리로
  const from = query.from === "history" ? "history" : undefined;
  return <RecommendationResultView id={decodeURIComponent(id)} from={from} />;
}

export default function RecommendationResultPage({ params, searchParams }: PageProps<"/recommendations/[id]">) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<RecommendationResultSkeleton />}>
          <ResultLoader params={params} searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
