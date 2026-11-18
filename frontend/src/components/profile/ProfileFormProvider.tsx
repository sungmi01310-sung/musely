"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  beautyProfileSchema,
  EMPTY_FORM_VALUES,
  sanitizeProfileValues,
  toBeautyProfile,
  type BeautyProfileFormValues,
  type BeautyProfileParsed,
} from "@/lib/profile/schema";
import { clearDraft, isEmptyDraft, readDraft, writeDraft } from "@/lib/profile/draft-storage";
import { getMyBeautyProfile, saveMyBeautyProfile, type SavedBeautyProfile } from "@/lib/api/profile";

/* ──────────────────────────────────────────────────────────────
   ProfileFormProvider
   - /profile 레이아웃에 한 번만 마운트 → STEP 1 ↔ STEP 2 이동 시 값 유지
   - 하나의 React Hook Form 인스턴스(+Zod)로 두 단계 전체를 관리
   - 입력 중 값은 localStorage에 자동 임시 저장(Draft) → 새로고침해도 유지
   - "저장" 시에만 프로필 API(현재 Mock)로 전송하고 Draft는 삭제
   ────────────────────────────────────────────────────────────── */

type ProfileMode = "create" | "edit";

type ProfileFormContextValue = {
  /** localStorage 복원이 끝났는지 (끝나기 전엔 안내 배너를 숨김) */
  hydrated: boolean;
  mode: ProfileMode;
  /** 새로고침/재방문 시 임시 저장본을 복원했다면 그 저장 시각 */
  restoredDraftAt: number | null;
  /** 마지막 자동 임시 저장 시각 */
  draftSavedAt: number | null;
  /** 이번 세션에서 저장 완료된 프로필 (완료 화면 표시용) */
  saved: SavedBeautyProfile | null;
  /** 임시 저장본 복원 — 단계 폼이 마운트(하이드레이션)된 뒤 호출. 여러 번 불러도 1회만 적용 */
  restoreDraft: () => void;
  /** 저장된 프로필을 폼에 불러오기 (수정 모드) */
  loadSavedProfile: () => Promise<"loaded" | "kept-draft" | "none">;
  /** 임시 저장본을 지우고 처음부터 */
  discardDraft: () => void;
  /** 검증된 값을 저장 */
  saveProfile: (values: BeautyProfileParsed) => Promise<SavedBeautyProfile>;
  /** 완료 화면에서 다시 수정하러 갈 때 */
  resumeEditing: () => void;
};

const ProfileFormContext = createContext<ProfileFormContextValue | null>(null);

const DRAFT_DEBOUNCE_MS = 400;
const noopSubscribe = () => () => {};

type ProfileFormProviderProps = {
  children: ReactNode;
  /** 서버 컴포넌트 등에서 기존 프로필을 미리 주입할 때 (STEP 08 연동용) */
  initialProfile?: BeautyProfileFormValues;
};

export function ProfileFormProvider({ children, initialProfile }: ProfileFormProviderProps) {
  const form = useForm<BeautyProfileFormValues, unknown, BeautyProfileParsed>({
    resolver: zodResolver(beautyProfileSchema),
    defaultValues: initialProfile ?? EMPTY_FORM_VALUES,
    mode: "onChange", // 선택/해제 즉시 해당 필드 재검증 → 오류가 바로 사라짐
  });

  // 서버 렌더 · 하이드레이션 중에는 false, 이후 true → 하이드레이션 불일치 없이 클라이언트 전용 UI 표시
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  // 임시 저장본은 클라이언트에서 한 번만 읽음 (서버에서는 null)
  const [initialDraft] = useState(() => {
    if (typeof window === "undefined" || initialProfile) return null;
    const draft = readDraft();
    return draft && !isEmptyDraft(draft.values) ? draft : null;
  });

  const [mode, setMode] = useState<ProfileMode>(initialProfile ? "edit" : "create");
  const [restoredDraftAt, setRestoredDraftAt] = useState<number | null>(initialDraft?.updatedAt ?? null);
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(initialDraft?.updatedAt ?? null);
  const [saved, setSaved] = useState<SavedBeautyProfile | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1) 임시 저장본을 폼에 복원 (새로고침해도 입력 유지)
  //    페이지 세그먼트는 레이아웃보다 늦게 하이드레이션되므로, 여기(레이아웃)에서 바로 reset하면
  //    서버 HTML(빈 값)과 달라져 하이드레이션 오류가 납니다. → 각 단계 폼이 자신의 마운트 이후 호출.
  const restoredOnce = useRef(false);
  const restoreDraft = useCallback(() => {
    if (restoredOnce.current) return;
    restoredOnce.current = true;
    if (initialDraft) form.reset(initialDraft.values);
  }, [form, initialDraft]);

  // 2) 값이 바뀔 때마다 디바운스해서 임시 저장
  useEffect(() => {
    if (!hydrated) return;
    // subscribe: 리렌더 없이 값 변경만 구독
    const unsubscribe = form.subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          const clean = sanitizeProfileValues(values);
          if (isEmptyDraft(clean)) {
            clearDraft();
            setDraftSavedAt(null);
          } else {
            setDraftSavedAt(writeDraft(clean));
          }
        }, DRAFT_DEBOUNCE_MS);
      },
    });
    return () => {
      unsubscribe();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [form, hydrated]);

  const cancelPendingDraft = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  const loadSavedProfile = useCallback<ProfileFormContextValue["loadSavedProfile"]>(async () => {
    // 수정 도중이던 임시 저장본이 있으면 그것을 우선 (사용자 입력 보호)
    if (readDraft()) {
      setMode("edit");
      return "kept-draft";
    }
    const result = await getMyBeautyProfile();
    if (!result) return "none";
    form.reset(sanitizeProfileValues(result.profile));
    setMode("edit");
    return "loaded";
  }, [form]);

  const discardDraft = useCallback(() => {
    restoredOnce.current = true;
    cancelPendingDraft();
    clearDraft();
    form.reset(EMPTY_FORM_VALUES);
    setRestoredDraftAt(null);
    setDraftSavedAt(null);
    setSaved(null);
    setMode("create");
  }, [form]);

  const saveProfile = useCallback(async (values: BeautyProfileParsed) => {
    cancelPendingDraft();
    const result = await saveMyBeautyProfile(toBeautyProfile(values));
    cancelPendingDraft();
    clearDraft(); // 확정 저장되었으므로 임시 저장본은 폐기
    setDraftSavedAt(null);
    setRestoredDraftAt(null);
    setSaved(result);
    return result;
  }, []);

  const resumeEditing = useCallback(() => {
    setSaved(null);
    setMode("edit");
  }, []);

  const value = useMemo<ProfileFormContextValue>(
    () => ({
      hydrated,
      mode,
      restoredDraftAt,
      draftSavedAt,
      saved,
      restoreDraft,
      loadSavedProfile,
      discardDraft,
      saveProfile,
      resumeEditing,
    }),
    [
      hydrated,
      mode,
      restoredDraftAt,
      draftSavedAt,
      saved,
      restoreDraft,
      loadSavedProfile,
      discardDraft,
      saveProfile,
      resumeEditing,
    ],
  );

  return (
    <ProfileFormContext.Provider value={value}>
      <FormProvider {...form}>{children}</FormProvider>
    </ProfileFormContext.Provider>
  );
}

/** 프로필 진행 상태/액션 */
export function useProfileFlow() {
  const ctx = useContext(ProfileFormContext);
  if (!ctx) throw new Error("useProfileFlow는 ProfileFormProvider 안에서만 사용할 수 있어요.");
  return ctx;
}

/** 프로필 폼(React Hook Form) */
export function useProfileForm() {
  return useFormContext<BeautyProfileFormValues, unknown, BeautyProfileParsed>();
}
