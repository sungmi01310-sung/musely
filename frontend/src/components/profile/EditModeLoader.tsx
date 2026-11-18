"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useProfileFlow } from "./ProfileFormProvider";

/**
 * /profile/skin?mode=edit 으로 들어오면 저장된 프로필을 폼에 불러옵니다.
 * (설정 > 뷰티 프로필 수정 등에서 사용 — STEP 05)
 * useSearchParams 사용으로 <Suspense> 안에서 렌더링해야 합니다.
 */
export function EditModeLoader() {
  const params = useSearchParams();
  const { hydrated, loadSavedProfile } = useProfileFlow();
  const done = useRef(false);

  useEffect(() => {
    if (!hydrated || done.current || params.get("mode") !== "edit") return;
    done.current = true;
    void loadSavedProfile();
  }, [hydrated, params, loadSavedProfile]);

  return null;
}
