import Image from "next/image";
import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ──────────────────────────────────────────────────────────────
   Card — 기본 서피스
   ────────────────────────────────────────────────────────────── */

type CardVariant = "surface" | "outline" | "lavender" | "glass" | "dark";

const cardVariants: Record<CardVariant, string> = {
  surface: "bg-white/70 border border-line",
  outline: "bg-transparent border border-line-strong",
  lavender: "bg-lavender border border-lavender-deep/60",
  glass:
    "bg-ivory/70 border border-white/60 backdrop-blur-xl shadow-[0_24px_60px_-28px_rgba(37,35,32,0.35)]",
  dark: "bg-charcoal text-ivory border border-white/10",
};

type CardProps<T extends ElementType> = {
  as?: T;
  variant?: CardVariant;
  /** 호버 시 살짝 떠오르는 인터랙션 */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<T>, "as" | "className" | "children">;

export function Card<T extends ElementType = "div">({
  as,
  variant = "surface",
  interactive = false,
  className,
  children,
  ...rest
}: CardProps<T>) {
  const Component: ElementType = as ?? "div";
  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-[1.25rem]",
        cardVariants[variant],
        interactive &&
          "transition-[transform,box-shadow] duration-700 ease-editorial hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(37,35,32,0.28)]",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

/* ──────────────────────────────────────────────────────────────
   EditorialCard — 이미지 + 넘버링 + 타이틀 (서비스 소개용)
   ────────────────────────────────────────────────────────────── */

type EditorialCardProps = {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  className?: string;
};

export function EditorialCard({
  index,
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  className,
}: EditorialCardProps) {
  return (
    <article className={cn("group", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-ivory-deep">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-[1.6s] ease-editorial group-hover:scale-[1.06]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-ivory/85 px-3 py-1.5 font-serif text-sm italic backdrop-blur">
          {index}
        </span>
      </div>
      <p className="eyebrow mt-6 text-subtle">{eyebrow}</p>
      <h3 className="mt-3 text-xl font-medium tracking-[-0.02em]">{title}</h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{description}</p>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────
   ProductCard — 추천 결과 카드 (매칭률, 태그)
   ────────────────────────────────────────────────────────────── */

type ProductCardProps = {
  image: string;
  brand: string;
  name: string;
  category: string;
  match: number;
  tags: string[];
  className?: string;
};

export function ProductCard({
  image,
  brand,
  name,
  category,
  match,
  tags,
  className,
}: ProductCardProps) {
  return (
    <Card variant="glass" className={cn("flex items-center gap-4 p-3 pr-5", className)}>
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-ivory-deep sm:size-[72px]">
        <Image src={image} alt={name} fill sizes="72px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow truncate text-subtle">{brand}</p>
          <p className="font-serif text-lg leading-none">
            {match}
            <span className="text-xs text-subtle">%</span>
          </p>
        </div>
        <p className="mt-1.5 truncate text-[15px] font-medium">
          {name}
          <span className="ml-1.5 font-serif text-sm font-normal italic text-subtle">{category}</span>
        </p>
        <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-charcoal/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-deep to-sage-deep"
            style={{ width: `${match}%` }}
          />
        </div>
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li key={tag} className="rounded-full bg-lavender px-2 py-0.5 text-[11px] text-charcoal-soft">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
