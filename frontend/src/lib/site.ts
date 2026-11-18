/** Site-wide navigation & brand config. */

export const siteConfig = {
  name: "musely",
  tagline: "Beauty, mused for you.",
} as const;

export const mainNav = [
  { label: "브랜드 스토리", href: "/#about" },
  { label: "맞춤 추천", href: "/#personalize" },
  { label: "향 큐레이션", href: "/#fragrance" },
  { label: "이용 방법", href: "/#how" },
] as const;

export const footerNav = [
  {
    title: "Service",
    links: [
      { label: "AI 추천받기", href: "/#start" },
      { label: "피부 프로필", href: "/profile/skin" },
      { label: "향 취향 프로필", href: "/profile/fragrance" },
      { label: "추천 히스토리", href: "/history" },
    ],
  },
  {
    title: "musely",
    links: [
      { label: "브랜드 스토리", href: "/#about" },
      { label: "이용 방법", href: "/#how" },
      { label: "공지사항", href: "/notice" },
      { label: "문의하기", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "로그인", href: "/login" },
      { label: "회원가입", href: "/signup" },
      { label: "설정", href: "/settings" },
    ],
  },
] as const;

/** 홈 화면의 "피부 / 향수 / 둘 다" 선택지 → 다음 단계 경로 */
export const focusOptions = [
  {
    id: "skin",
    en: "Skincare",
    label: "피부",
    description: "피부 타입과 고민, 기피 성분을 바탕으로 스킨케어를 추천받아요.",
    duration: "약 2분",
    image: "/images/serum-botanical.jpg",
    href: "/profile/skin",
  },
  {
    id: "scent",
    en: "Fragrance",
    label: "향수",
    description: "좋아하는 향의 계열과 무드, 계절을 바탕으로 향수를 추천받아요.",
    duration: "약 2분",
    image: "/images/fragrance-amber.jpg",
    href: "/profile/fragrance",
  },
  {
    id: "both",
    en: "Both",
    label: "둘 다",
    description: "피부와 향을 함께 분석해 하나의 루틴처럼 어울리는 조합을 제안해요.",
    duration: "약 4분",
    image: "/images/ritual-hands.jpg",
    href: "/profile/skin",
  },
] as const;

export type FocusId = (typeof focusOptions)[number]["id"];
