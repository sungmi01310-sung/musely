import Image from "next/image";
import { Check } from "lucide-react";
import type { CosmeticRecommendation } from "@/types/recommendation";
import { SampleTag } from "./MockNotice";

type CosmeticProductCardProps = {
  product: CosmeticRecommendation;
  index: number;
  sample?: boolean;
};

/** 스킨케어 큐레이션 카드 — 이미지(4:5 통일) → 추천 이유 → 제품 정보 순 */
export function CosmeticProductCard({ product, index, sample }: CosmeticProductCardProps) {
  const hasScore = typeof product.score === "number";
  return (
    <article className="group flex flex-col" aria-labelledby={`cos-${product.itemId}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-ivory-deep">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            className="object-cover transition-transform duration-[1.4s] ease-editorial group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-lavender to-rose/60" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-charcoal/35 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-ivory/85 px-3 py-1 text-[12px] text-charcoal backdrop-blur">
          {product.category}
        </span>
        {sample && <SampleTag className="absolute right-4 top-4" />}
        <span className="absolute bottom-4 left-5 font-serif text-[1.9rem] leading-none italic text-ivory">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow text-subtle">{product.brand}</p>
          <h3 id={`cos-${product.itemId}`} className="mt-2 text-[17px] font-medium tracking-[-0.025em]">
            {product.name}
          </h3>
        </div>
        {hasScore && (
          <p className="shrink-0 text-right" aria-label={`적합도 ${product.score}점`}>
            <span className="font-serif text-[1.8rem] leading-none">{product.score}</span>
            <span className="mt-1 block text-[10.5px] tracking-[0.12em] text-subtle uppercase">Match</span>
          </p>
        )}
      </div>

      {/* 추천 이유 — 카드에서 가장 중요한 정보 */}
      <div className="mt-4 rounded-2xl bg-lavender/70 px-4 py-3.5">
        <p className="text-[11px] font-medium tracking-[0.14em] text-rose-ink uppercase">Why this · 추천 이유</p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-charcoal">{product.reason}</p>
        {product.reasonDetails && product.reasonDetails.length > 0 && (
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {product.reasonDetails.map((d) => (
              <li key={d} className="flex gap-1.5 text-[12.5px] leading-relaxed text-muted">
                <Check className="mt-[3px] size-3 shrink-0 text-sage-deep" strokeWidth={2} aria-hidden />
                {d}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <p className="text-[12px] text-subtle">주요 성분</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {product.keyIngredients.map((ing) => (
            <li key={ing} className="rounded-full border border-line-strong px-2.5 py-0.5 text-[12.5px] text-charcoal-soft">
              {ing}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
