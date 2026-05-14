import { createContext, type FormEvent } from "react";

export type LoginPageContextValue = {
  name: string;
  setName: (name: string) => void;
  isSubmitting: boolean;
  message: string | null;
  errorMessage: string | null;
  handleGuestLogin: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export const LoginPageContext = createContext<LoginPageContextValue | null>(null);
