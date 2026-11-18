import { cn } from "@/lib/cn";

type MarqueeProps = {
  items: string[];
  className?: string;
};

/** 무한 흐르는 텍스트 띠 (CSS 애니메이션) */
export function Marquee({ items, className }: MarqueeProps) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="px-6 font-serif text-2xl italic sm:px-10 sm:text-[2rem]">{item}</span>
          <span className="text-sm text-rose-deep" aria-hidden>
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
