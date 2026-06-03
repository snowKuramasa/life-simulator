import { createContext } from "react";

import type { Commute, Residence, Workplace } from "@/types";

export type ResultStatus = "余裕あり" | "普通" | "やや厳しい";
export type ResultSortKey = "disposableIncome" | "commuteMinutes";
export type CommuteSaveStatus = "idle" | "saving" | "success" | "error";

export type ResultListItem = {
  id: string;
  workplace: Workplace;
  residence: Residence;
  commute: Commute | null;
  disposableIncome: number;
  status: ResultStatus;
};

export type ResultListPageContextValue = {
  results: ResultListItem[];
  sortKey: ResultSortKey;
  setSortKey: (sortKey: ResultSortKey) => void;
  commuteSaveStatuses: Record<string, CommuteSaveStatus | undefined>;
  saveCommuteMinutes: (result: ResultListItem, commuteMinutes: number) => Promise<boolean>;
  isLoading: boolean;
  errorMessage: string | null;
};

export const ResultListPageContext = createContext<ResultListPageContextValue | null>(null);
