import { createContext } from "react";

import type { Commute, Residence, Workplace } from "@/types";

export type ResultStatus = "余裕あり" | "普通" | "やや厳しい" | "厳しい";
export type ResultSortKey = "monthlySurplus" | "commuteMinutes";
export type HouseholdSize = "single";
export type CommuteSaveStatus = "idle" | "saving" | "success" | "error";

export type ResultListItem = {
  id: string;
  workplace: Workplace;
  residence: Residence;
  commute: Commute | null;
  monthlySurplus: number;
  status: ResultStatus;
};

export type ResultListPageContextValue = {
  results: ResultListItem[];
  sortKey: ResultSortKey;
  setSortKey: (sortKey: ResultSortKey) => void;
  householdSize: HouseholdSize;
  setHouseholdSize: (householdSize: HouseholdSize) => void;
  commuteSaveStatuses: Record<string, CommuteSaveStatus | undefined>;
  saveCommuteMinutes: (result: ResultListItem, commuteMinutes: number) => Promise<boolean>;
  isLoading: boolean;
  errorMessage: string | null;
};

export const ResultListPageContext = createContext<ResultListPageContextValue | null>(null);
