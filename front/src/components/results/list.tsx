import resultImage from "@/assets/2.png";
import { Button } from "@/components/common/baseUi/Button";
import { Image } from "@/components/common/baseUi/Image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ResultListItem, ResultSortKey } from "@/providers/pages/ResultListPageContext";
import { Building2, Cloud, Clock, Coins, Home, Infinity, MoreHorizontal, Sun } from "lucide-react";
import { Link } from "react-router";

import styles from "./list.module.css";

type ResultListProps = {
  results: ResultListItem[];
  sortKey: ResultSortKey;
  setSortKey: (sortKey: ResultSortKey) => void;
  isLoading: boolean;
  errorMessage: string | null;
};

function formatMoney(amount: number) {
  if (amount % 10_000 === 0) {
    return `${amount / 10_000}万円`;
  }

  return `${amount.toLocaleString()}円`;
}

function StatusIcon({ status }: { status: ResultListItem["status"] }) {
  if (status === "余裕あり") {
    return <Sun className={styles.sunIcon} aria-hidden="true" size={20} />;
  }

  return <Cloud className={styles.cloudIcon} aria-hidden="true" size={20} />;
}

export function ResultList({ results, sortKey, setSortKey, isLoading, errorMessage }: ResultListProps) {
  return (
    <section className={styles.hero} aria-labelledby="result-list-title">
      <h1 id="result-list-title" className={styles.visuallyHidden}>
        結果一覧画面
      </h1>

      <div className={styles.headerArea}>
        <div className={styles.sortField}>
          <Select value={sortKey} onValueChange={(value) => setSortKey(value as ResultSortKey)}>
            <SelectTrigger className={styles.sortSelect} aria-label="並び順">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disposableIncome">並び順：残るお金</SelectItem>
              <SelectItem value="commuteMinutes">並び順：通勤時間</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Image
          src={resultImage}
          alt="赤い自動販売機の横に立っている人のイラスト"
          width={{ base: 96, md: 150 }}
          height={{ base: 96, md: 150 }}
        />
      </div>

      <div className={styles.list} aria-live="polite">
        {isLoading ? <p className={styles.statusMessage}>結果を読み込んでいます。</p> : null}
        {!isLoading && results.length === 0 ? (
          <p className={styles.statusMessage}>勤務先と住居を登録すると結果が表示されます。</p>
        ) : null}

        {results.map((result) => (
          <article key={result.id} className={styles.card}>
            <div className={styles.titleRow}>
              <Building2 aria-hidden="true" size={19} />
              <p className={styles.titleText}>
                <span>{result.workplace.name}</span>
                <span>×</span>
                <Home aria-hidden="true" size={18} />
                <span>{result.residence.name}</span>
              </p>
              <Infinity aria-hidden="true" size={18} />
            </div>

            <div className={styles.infoRow}>
              <Coins className={styles.icon} aria-hidden="true" size={20} />
              <p>
                残るお金
                <span className={styles.inlineValue}>{formatMoney(result.disposableIncome)}</span>
              </p>
            </div>

            <div className={styles.infoRow}>
              <Clock className={styles.icon} aria-hidden="true" size={20} />
              <p>{result.commute ? `${result.commute.commute_minutes}分` : "未入力"}</p>
            </div>

            <div className={styles.infoRow}>
              <StatusIcon status={result.status} />
              <p>{result.status}</p>
            </div>

            <MoreHorizontal className={styles.moreIcon} aria-hidden="true" size={22} />
          </article>
        ))}
      </div>

      <div className={styles.actions}>
        <Button asChild>
          <Link to="/workplaces">勤務先一覧</Link>
        </Button>
        <Button asChild>
          <Link to="/residences">住居一覧</Link>
        </Button>
      </div>

      {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}
    </section>
  );
}
