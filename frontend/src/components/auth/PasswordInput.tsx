"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthInput, type AuthInputProps } from "./AuthInput";

type PasswordInputProps = Omit<AuthInputProps, "type" | "trailing">;

/** 표시/숨기기 토글이 있는 비밀번호 입력 */
export function PasswordInput({ id, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <AuthInput
      {...props}
      id={inputId}
      type={visible ? "text" : "password"}
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
          aria-pressed={visible}
          aria-controls={inputId}
          className="mr-1.5 inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-subtle transition-colors hover:text-charcoal focus-visible:outline-offset-0"
        >
          {visible ? (
            <EyeOff className="size-[18px]" strokeWidth={1.5} aria-hidden />
          ) : (
            <Eye className="size-[18px]" strokeWidth={1.5} aria-hidden />
          )}
        </button>
      }
    />
  );
}
