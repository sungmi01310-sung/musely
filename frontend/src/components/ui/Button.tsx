import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "light" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap font-medium tracking-[-0.01em] transition-[color,background-color,border-color,box-shadow,transform] duration-500 ease-editorial active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  // 차콜 → 호버 시 라벤더가 아래에서 차오르는 필
  primary:
    "rounded-full bg-charcoal text-ivory hover:text-charcoal before:absolute before:inset-0 before:translate-y-full before:rounded-full before:bg-lavender-deep before:transition-transform before:duration-500 before:ease-editorial hover:before:translate-y-0",
  secondary:
    "rounded-full border border-charcoal/25 text-charcoal hover:border-charcoal before:absolute before:inset-0 before:translate-y-full before:rounded-full before:bg-charcoal before:transition-transform before:duration-500 before:ease-editorial hover:text-ivory hover:before:translate-y-0",
  light:
    "rounded-full bg-ivory text-charcoal before:absolute before:inset-0 before:translate-y-full before:rounded-full before:bg-rose before:transition-transform before:duration-500 before:ease-editorial hover:before:translate-y-0",
  ghost:
    "rounded-full text-charcoal hover:bg-charcoal/5",
  link: "rounded-none px-0 text-charcoal link-underline pb-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-[15px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** 오른쪽에 화살표 아이콘을 표시 (호버 시 대각선으로 빠져나가는 모션) */
  arrow?: boolean;
  /** 제출 중 상태 — 스피너 표시 + 클릭 비활성화 (button 전용) */
  loading?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps> & { href: string };
type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, keyof CommonProps> & { href?: undefined };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

function Arrow() {
  return (
    <span className="relative inline-flex size-4 overflow-hidden" aria-hidden>
      <ArrowUpRight
        strokeWidth={1.5}
        className="absolute inset-0 size-4 transition-transform duration-500 ease-editorial group-hover/btn:translate-x-full group-hover/btn:-translate-y-full"
      />
      <ArrowUpRight
        strokeWidth={1.5}
        className="absolute inset-0 size-4 -translate-x-full translate-y-full transition-transform duration-500 ease-editorial group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"
      />
    </span>
  );
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", arrow, loading = false, className, children, ...rest } = props;
  const classes = cn(
    base,
    variants[variant],
    variant !== "link" && sizes[size],
    loading && "pointer-events-none disabled:opacity-100",
    className,
  );
  const content = (
    <span className="relative z-10 inline-flex items-center gap-2.5">
      {loading && <LoaderCircle className="size-4 animate-spin" strokeWidth={1.75} aria-hidden />}
      {children}
      {arrow && !loading && <Arrow />}
    </span>
  );

  if (typeof rest.href === "string") {
    const { href, ...linkProps } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  const { disabled, ...buttonProps } = rest as Omit<ButtonAsButton, keyof CommonProps>;
  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
