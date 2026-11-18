import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** 페이지 공통 좌우 여백과 최대 폭 */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12", className)}
      {...props}
    />
  );
}
