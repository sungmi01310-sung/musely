import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Droplet, Layers, SprayCan, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { recommendationResultPath } from "@/lib/routes";
import { HISTORY_TRACK_LABEL } from "@/lib/recommendation/history";
import type { RecommendationHistory, RecommendationHistoryTrack } from "@/types/recommendation";

const TRACK_STYLE: Record<RecommendationHistoryTrack, { Icon: LucideIcon; className: string }> = {
  COSMETIC: { Icon: Droplet, className: "bg-lavender text-charcoal" },
  FRAGRANCE: { Icon: SprayCan, className: "bg-rose/45 text-charcoal" },
  BOTH: { Icon: Layers, className: "bg-sage/30 text-charcoal" },
};

const dayFmt = new Intl.DateTimeFormat("en-US", { day: "2-digit" });
const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });
const fullFmt = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" });

export function TrackBadge({ track }: { track: RecommendationHistoryTrack }) {
  const { Icon, className } = TRACK_STYLE[track];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium", className)}>
      <Icon className="size-3.5" strokeWidth={1.6} aria-hidden />
      {HISTORY_TRACK_LABEL[track]}
    </span>
  );
}

/** 에디토리얼 리스트형 히스토리 카드 — 카드 전체가 상세 링크 */
export function HistoryCard({ item }: { item: RecommendationHistory }) {
  const date = new Date(item.createdAt);
  const counts =
    item.cosmeticCount !== undefined && item.fragranceCount !== undefined
      ? [item.cosmeticCount ? `화장품 ${item.cosmeticCount}` : null, item.fragranceCount ? `향수 ${item.fragranceCount}` : null]
          .filter(Boolean)
          .join(" · ")
      : null;
  const thumbs = item.thumbnailUrls ?? [];

  return (
    <Link
      href={`${recommendationResultPath(item.recommendationId)}?from=history`}
      className="group relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-5 overflow-hidden rounded-[1.75rem] px-4 py-7 transition-colors duration-700 ease-editorial hover:bg-lavender/45 focus-visible:bg-lavender/45 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-x-8 sm:px-6 lg:px-8"
    >
      {/* 날짜 — 에디토리얼 타이포 */}
      <time dateTime={item.createdAt} className="flex flex-col items-start leading-none">
        <span className="font-serif text-[2.6rem] tracking-[-0.03em] sm:text-[3.2rem]">{dayFmt.format(date)}</span>
        <span className="mt-1.5 font-serif text-[15px] italic text-muted">{monthFmt.format(date)}</span>
        <span className="sr-only">{fullFmt.format(date)}</span>
      </time>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <TrackBadge track={item.track} />
          <span className="text-[12.5px] text-muted">
            제품 {item.itemCount}개{counts && <span className="text-subtle"> · {counts}</span>}
          </span>
          {item.sample && (
            <span className="rounded-full border border-charcoal/15 px-2 py-0.5 text-[10px] font-medium tracking-[0.14em] text-subtle uppercase">
              Sample
            </span>
          )}
        </div>
        <p className="mt-3 line-clamp-3 text-[15.5px] leading-relaxed text-charcoal sm:line-clamp-2 sm:text-[16.5px]">
          {item.summary}
        </p>
        {item.tags && item.tags.length > 0 && (
          <p className="mt-2.5 text-[12.5px] text-subtle">{item.tags.map((t) => `#${t}`).join("  ")}</p>
        )}
      </div>

      {/* 대표 이미지 + 상세 보기 */}
      <div className="col-span-2 flex items-center justify-between gap-6 sm:col-span-1 sm:justify-end">
        {thumbs.length > 0 && (
          <div className="flex -space-x-4 sm:-space-x-5" aria-hidden>
            {thumbs.map((src, i) => (
              <span
                key={`${src}-${i}`}
                className="relative size-12 overflow-hidden rounded-full border-2 border-ivory sm:size-14"
                style={{ zIndex: thumbs.length - i }}
              >
                <Image src={src} alt="" fill sizes="56px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </span>
            ))}
          </div>
        )}
        <span className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap text-[13.5px] font-medium text-charcoal">
          상세 보기
          <span className="flex size-9 items-center justify-center rounded-full border border-charcoal/20 transition-[background-color,color,transform] duration-500 ease-editorial group-hover:rotate-45 group-hover:bg-charcoal group-hover:text-ivory">
            <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
          </span>
        </span>
      </div>
    </Link>
  );
}
