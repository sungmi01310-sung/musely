import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

type NavAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

type ProfileNavigationProps = {
  back?: NavAction;
  skip?: NavAction;
  primary: NavAction & { type?: "submit" | "button"; arrow?: boolean };
  /** 버튼 위에 표시할 짧은 안내 */
  hint?: ReactNode;
  className?: string;
};

/**
 * 단계 이동 버튼 바 — 모바일에선 화면 하단에 고정(엄지 영역),
 * 데스크톱에선 폼 하단에 자연스럽게 배치.
 */
export function ProfileNavigation({ back, skip, primary, hint, className }: ProfileNavigationProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 -mx-5 mt-14 border-t border-line bg-ivory/90 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl sm:-mx-8 sm:px-8",
        "lg:static lg:mx-0 lg:border-t lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-8 lg:backdrop-blur-none",
        className,
      )}
    >
      {hint && <div className="mb-3 text-[12.5px] text-muted">{hint}</div>}
      <div className="flex items-center gap-2 sm:gap-3">
        {back &&
          (back.href ? (
            <Link
              href={back.href}
              className="inline-flex h-14 shrink-0 items-center gap-1.5 rounded-full px-3 text-[14px] text-muted transition-colors hover:text-charcoal sm:px-4"
            >
              <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden />
              {back.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={back.onClick}
              disabled={back.disabled}
              className="inline-flex h-14 shrink-0 items-center gap-1.5 rounded-full px-3 text-[14px] text-muted transition-colors hover:text-charcoal disabled:opacity-40 sm:px-4"
            >
              <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden />
              {back.label}
            </button>
          ))}

        <div className="ml-auto flex flex-1 items-center justify-end gap-2 sm:flex-none sm:gap-3">
          {skip && (
            <Button
              variant="secondary"
              size="lg"
              onClick={skip.onClick}
              disabled={skip.disabled}
              loading={skip.loading}
              className="px-5 sm:px-7"
            >
              {skip.label}
            </Button>
          )}
          <Button
            type={primary.type ?? "button"}
            size="lg"
            arrow={primary.arrow}
            onClick={primary.onClick}
            disabled={primary.disabled}
            loading={primary.loading}
            className="flex-1 sm:flex-none sm:min-w-44"
          >
            {primary.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
