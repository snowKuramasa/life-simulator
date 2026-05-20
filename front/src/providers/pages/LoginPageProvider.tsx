import { type FormEvent, type ReactNode, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "@/hooks/useAuth";
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

  async function handleGuestLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    try {
      const response = await guestLogin({ name });
      setMessage(`こんにちは${response.user?.name ?? "ゲスト"}さん`);
      navigate("/workplaces/new?flow=initial");
    } catch {
      setErrorMessage("ゲストログインに失敗しました。時間をおいてもう一度お試しください。");
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
        handleGuestLogin,
      }}
    >
      {children}
    </LoginPageContext.Provider>
  );
}
