import { createContext, type FormEvent } from "react";

import type { AuthUser } from "@/types";

export type LoginPageContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  name: string;
  setName: (name: string) => void;
  isSubmitting: boolean;
  message: string | null;
  errorMessage: string | null;
  handleGuestLogin: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export const LoginPageContext = createContext<LoginPageContextValue | null>(null);
