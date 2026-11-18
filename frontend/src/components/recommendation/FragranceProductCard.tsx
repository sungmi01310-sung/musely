import Image from "next/image";
import { cn } from "@/lib/cn";
import { SCENT_FAMILIES } from "@/lib/profile/options";
import type { FragranceRecommendation } from "@/types/recommendation";
import { SampleTag } from "./MockNotice";

const DEFAULT_SWATCH = "#D8C5CE";

function familyMeta(code: string) {
  const f = SCENT_FAMILIES.find((s) => s.value === code);
  return { label: f?.label ?? code, en: f?.en ?? code, swatch: f?.swatch ?? DEFAULT_SWATCH };
}

type FragranceProductCardProps = {
  product: FragranceRecommendation;
  sample?: boolean;
  /** 넓은 레이아웃 (홀수 개일 때 첫 카드) */
  featured?: boolean;
};

/** 향수 카드 — 향 계열 색으로 번지는 "아우라" + 아치형 이미지 + 노트 피라미드 */
export function FragranceProductCard({ product, sample, featured }: FragranceProductCardProps) {
  const fam = familyMeta(product.family);
  const notes = [
    { key: "Top", label: "탑", values: product.notes.top },
    { key: "Heart", label: "하트", values: product.notes.heart },
    { key: "Base", label: "베이스", values: product.notes.base },
  ];

  return (
    <article
      aria-labelledby={`fra-${product.itemId}`}
      className={cn(
        "relative grid gap-6 overflow-hidden rounded-[2rem] border border-white/70 p-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8 sm:p-7",
        featured && "lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:p-9",
      )}
      style={{
        background: `radial-gradient(120% 90% at 0% 0%, ${fam.swatch}66 0%, transparent 55%), radial-gradient(90% 80% at 100% 100%, ${fam.swatch}40 0%, transparent 60%), #faf8f5`,
      }}
    >
      {/* 아치형 이미지 */}
      <div className="relative mx-auto aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-t-full rounded-b-[1.25rem] sm:max-w-none">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 640px) 35vw, 80vw"
            className="object-cover"
          />
        ) : null}
        {/* 향 계열 색을 은은하게 덧입힘 */}
        <div className="absolute inset-0 mix-blend-soft-light" style={{ backgroundColor: fam.swatch }} />
        {sample && <SampleTag className="absolute bottom-3 left-1/2 -translate-x-1/2" />}
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-4">
          <p className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: fam.swatch }} aria-hidden />
            <span className="font-serif text-[1.6rem] leading-none italic">{fam.en}</span>
            <span className="text-[12.5px] text-muted">{fam.label} 계열</span>
          </p>
          {typeof product.score === "number" && (
            <p className="shrink-0 text-right" aria-label={`적합도 ${product.score}점`}>
              <span className="font-serif text-[1.6rem] leading-none">{product.score}</span>
              <span className="mt-1 block text-[10.5px] tracking-[0.12em] text-subtle uppercase">Match</span>
            </p>
          )}
        </div>

        <p className="eyebrow mt-6 text-subtle">{product.brand}</p>
        <h3 id={`fra-${product.itemId}`} className="mt-2 text-[1.35rem] font-light tracking-[-0.035em]">
          {product.name}
        </h3>
        {product.concentration && <p className="mt-1 text-[12.5px] text-muted">{product.concentration}</p>}

        <p className="mt-5 border-l-2 pl-4 text-[15px] leading-relaxed text-charcoal" style={{ borderColor: fam.swatch }}>
          <span className="sr-only">추천 이유: </span>
          {product.reason}
        </p>

        <dl className="mt-6 divide-y divide-charcoal/10 border-y border-charcoal/10">
          {notes.map((n) => (
            <div key={n.key} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-3 py-2.5">
              <dt>
                <span className="font-serif text-[15px] italic">{n.key}</span>
                <span className="sr-only"> 노트({n.label})</span>
              </dt>
              <dd className="text-[13.5px] text-charcoal-soft">{n.values.length ? n.values.join(" · ") : "—"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
