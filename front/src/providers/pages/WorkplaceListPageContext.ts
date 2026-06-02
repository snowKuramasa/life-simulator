import { createContext } from "react";

import type { Workplace } from "@/types";

export type WorkplaceListPageContextValue = {
  workplaces: Workplace[];
  isLoading: boolean;
  deletingId: number | null;
  message: string | null;
  errorMessage: string | null;
  handleDelete: (id: number) => Promise<void>;
};

export const WorkplaceListPageContext = createContext<WorkplaceListPageContextValue | null>(null);
