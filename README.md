# musely

AI 맞춤 화장품 · 향수 추천 플랫폼. 피부 타입, 피부 고민, 기피 성분, 사용 중인 성분, 향 취향을 바탕으로 제품을 추천하고 그 이유를 설명합니다.

## 구성

| 폴더 | 내용 | 상태 |
|---|---|---|
| `frontend/` | Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 | STEP 01–05 완료 |
| `backend/` | NestJS · Prisma · MySQL · Redis · Passport/JWT · Swagger | STEP 06 예정 |

AI 추천 서비스(FastAPI · LangGraph · Vector DB)는 별도로 개발됩니다.

## 실행

```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

## 진행 상황

- [x] STEP 01 디자인 시스템 · 메인 홈
- [x] STEP 02 로그인 · 회원가입 (UI만, 인증 API 미연결)
- [x] STEP 03 피부 · 향 취향 프로필 (Mock 저장)
- [x] STEP 04 AI 추천 진행 · 결과 화면 (Mock 어댑터)
- [x] STEP 05 추천 히스토리 · 마이페이지(설정)
- [ ] STEP 06 NestJS 백엔드
- [ ] STEP 07 MySQL · Prisma · Redis
- [ ] STEP 08 프론트엔드 ↔ 백엔드 연동
- [ ] STEP 09 AI 서비스 연동
- [ ] STEP 10 테스트 · 배포

> 현재 추천 · 프로필 · 피드백은 브라우저에만 저장되는 개발용 Mock이며, 화면에 "Mock/샘플"로 표시됩니다.
> 실제 API로 전환: `NEXT_PUBLIC_RECOMMENDATION_ADAPTER=api`, `NEXT_PUBLIC_API_BASE_URL=...`
