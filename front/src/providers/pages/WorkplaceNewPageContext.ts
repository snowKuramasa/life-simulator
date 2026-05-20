import { createContext, type FormEvent } from "react";

export type WorkplaceNewPageContextValue = {
  name: string;
  setName: (name: string) => void;
  salary: string;
  setSalary: (salary: string) => void;
  prefecture: string;
  setPrefecture: (prefecture: string) => void;
  city: string;
  setCity: (city: string) => void;
  isInitialFlow: boolean;
  isSubmitting: boolean;
  message: string | null;
  errorMessage: string | null;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export const WorkplaceNewPageContext = createContext<WorkplaceNewPageContextValue | null>(null);
