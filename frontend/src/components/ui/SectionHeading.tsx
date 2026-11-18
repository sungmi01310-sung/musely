import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  index: string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
};

/** "01 — About" 형태의 에디토리얼 섹션 헤더 */
export function SectionHeading({
  index,
  label,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  const light = tone === "light";
  return (
    <Reveal
      className={cn(
        "flex flex-col",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <p className={cn("eyebrow flex items-center gap-3", light ? "text-ivory/60" : "text-subtle")}>
        <span className="font-serif text-sm normal-case italic tracking-normal">{index}</span>
        <span className={cn("h-px w-8", light ? "bg-ivory/30" : "bg-charcoal/20")} />
        {label}
      </p>
      <h2 className="mt-6 text-balance text-[2rem] leading-[1.18] font-light tracking-[-0.035em] sm:text-[2.6rem] lg:text-[3.1rem]">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 max-w-xl text-[15px] leading-[1.8] sm:text-base",
            light ? "text-ivory/70" : "text-muted",
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
