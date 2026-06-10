import { createContext } from "react";

import type { Residence } from "@/types";

export type ResidenceListPageContextValue = {
  residences: Residence[];
  isLoading: boolean;
  deletingId: number | null;
  message: string | null;
  errorMessage: string | null;
  handleDelete: (id: number) => Promise<void>;
};

export const ResidenceListPageContext = createContext<ResidenceListPageContextValue | null>(null);
