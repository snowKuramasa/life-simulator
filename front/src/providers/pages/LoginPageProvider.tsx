import { type FormEvent, type ReactNode, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api";
import { guestLoginFormSchema } from "@/lib/validation";
import { LoginPageContext } from "@/providers/pages/LoginPageContext";

type LoginPageProviderProps = {
  children: ReactNode;
};

export function LoginPageProvider({ children }: LoginPageProviderProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAuthLoading, guestLogin, isLoggingIn } = useAuth();
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const continuePath = isAuthenticated ? "/results" : "/workplaces/new?flow=initial";

  async function handleGuestLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);
    const parsedForm = guestLoginFormSchema.safeParse({ name });

    if (!parsedForm.success) {
      setErrorMessage("名前は50文字以内で入力してください。");
      return;
    }

    try {
      const response = await guestLogin({ name: parsedForm.data.name });
      setMessage(`こんにちは${response.user?.name ?? "ゲスト"}さん`);
      navigate(response.first_login ? "/workplaces/new?flow=initial" : "/results");
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "ゲストログインに失敗しました。時間をおいてもう一度お試しください。"),
      );
    }
  }

  return (
    <LoginPageContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        name,
        setName,
        isSubmitting: isLoggingIn,
        message,
        errorMessage,
        continuePath,
        handleGuestLogin,
      }}
    >
      {children}
    </LoginPageContext.Provider>
  );
}
