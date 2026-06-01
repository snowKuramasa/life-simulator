import { createContext, type FormEvent } from "react";

export type ResidenceEditPageContextValue = {
  name: string;
  setName: (name: string) => void;
  rent: string;
  setRent: (rent: string) => void;
  prefecture: string;
  setPrefecture: (prefecture: string) => void;
  city: string;
  setCity: (city: string) => void;
  isSubmitting: boolean;
  message: string | null;
  errorMessage: string | null;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export const ResidenceEditPageContext = createContext<ResidenceEditPageContextValue | null>(null);
