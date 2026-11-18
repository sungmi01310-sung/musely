import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "musely — AI 맞춤 화장품 · 향수 큐레이션",
    template: "%s | musely",
  },
  description:
    "피부 타입, 피부 고민, 기피 성분, 사용 중인 성분, 향 취향까지. musely의 AI가 당신에게 꼭 맞는 화장품과 향수를 추천하고, 그 이유를 설명합니다.",
  keywords: ["musely", "화장품 추천", "향수 추천", "AI 뷰티", "피부 타입", "성분 분석"],
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${cormorant.variable} antialiased`}>
      <body className="grain flex min-h-dvh flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
