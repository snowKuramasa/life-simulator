import { createContext, type FormEvent } from "react";

export type WorkplaceEditPageContextValue = {
  name: string;
  setName: (name: string) => void;
  salary: string;
  setSalary: (salary: string) => void;
  prefecture: string;
  setPrefecture: (prefecture: string) => void;
  city: string;
  setCity: (city: string) => void;
  isSubmitting: boolean;
  message: string | null;
  errorMessage: string | null;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export const WorkplaceEditPageContext = createContext<WorkplaceEditPageContextValue | null>(null);
