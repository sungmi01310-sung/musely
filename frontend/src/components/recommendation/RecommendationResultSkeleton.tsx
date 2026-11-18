import { Container } from "@/components/ui/Container";

const block = "animate-pulse rounded-2xl bg-ivory-deep";

/** 결과를 불러오는 동안의 자리표시 */
export function RecommendationResultSkeleton() {
  return (
    <Container className="max-w-[1280px] pb-24 pt-10 sm:pt-16" aria-busy="true" aria-label="추천 결과를 불러오는 중">
      <div className={`${block} h-4 w-40`} />
      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className={`${block} h-3 w-32`} />
          <div className={`${block} mt-6 h-12 w-full max-w-md`} />
          <div className={`${block} mt-3 h-12 w-3/4 max-w-sm`} />
          <div className={`${block} mt-6 h-4 w-2/3`} />
        </div>
        <div className="lg:col-span-6">
          <div className={`${block} h-24 w-full`} />
          <div className={`${block} mt-6 h-40 w-full`} />
        </div>
      </div>
      <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className={`${block} aspect-[4/5] w-full rounded-[1.5rem]`} />
            <div className={`${block} mt-5 h-4 w-1/2`} />
            <div className={`${block} mt-3 h-20 w-full`} />
          </div>
        ))}
      </div>
    </Container>
  );
}
