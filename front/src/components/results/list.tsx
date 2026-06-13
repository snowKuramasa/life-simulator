import resultImage from "@/assets/2.png";
import { Button } from "@/components/common/baseUi/Button";
import { Image } from "@/components/common/baseUi/Image";
import { Input } from "@/components/common/baseUi/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/baseUi/Select";
import { STANDARD_MONTHLY_LIVING_COST } from "@/constants/livingCosts";
import { MAX_COMMUTE_MINUTES } from "@/constants/validation";
import { cn } from "@/lib/utils";
import { commuteMinutesSchema, getSchemaError } from "@/lib/validation";
import type {
  CommuteSaveStatus,
  HouseholdSize,
  ResultListItem,
  ResultSortKey,
} from "@/providers/pages/ResultListPageContext";
import {
  Building2,
  Check,
  Cloud,
  Clock,
  Coins,
  Home,
  Info,
  LoaderCircle,
  Pencil,
  Sun,
  Umbrella,
  X,
} from "lucide-react";
import { type KeyboardEvent, useRef, useState } from "react";
import { Link } from "react-router";

import styles from "./list.module.css";

type ResultListProps = {
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

function formatMoney(amount: number) {
  if (amount === 0) {
    return "0円";
  }

  if (amount % 10_000 === 0) {
    return `${amount / 10_000}万円`;
  }

  return `${amount.toLocaleString()}円`;
}

function formatMonthlySurplus(amount: number) {
  if (amount < 0) {
    return `${formatMoney(Math.abs(amount))}不足`;
  }

  if (amount > 0) {
    return `+${formatMoney(amount)}`;
  }

  return formatMoney(amount);
}

function StatusIcon({ status }: { status: ResultListItem["status"] }) {
  if (status === "余裕あり") {
    return <Sun className={styles.sunIcon} aria-hidden="true" size={20} />;
  }

  if (status === "生活費不足") {
    return <Umbrella className={styles.umbrellaIcon} aria-hidden="true" size={20} />;
  }

  return <Cloud className={styles.cloudIcon} aria-hidden="true" size={20} />;
}

function SaveStatusIcon({ status }: { status: CommuteSaveStatus | undefined }) {
  if (status === "saving") {
    return <LoaderCircle className={styles.savingIcon} aria-label="保存中" size={17} />;
  }

  if (status === "success") {
    return <Check className={styles.successIcon} aria-label="保存しました" size={17} />;
  }

  if (status === "error") {
    return <X className={styles.errorIcon} aria-label="保存に失敗しました" size={17} />;
  }

  return null;
}

function MonthlySurplusHelp() {
  const description = `手取り月収から家賃と標準生活費${formatMoney(STANDARD_MONTHLY_LIVING_COST)}を引いた目安です。マイナスは、その生活費をまかなうには足りない金額です。`;

  return (
    <span className={styles.helpWrapper}>
      <button
        type="button"
        className={styles.helpButton}
        aria-label={`月の収支の説明。${description}`}
      >
        <Info aria-hidden="true" size={13} />
      </button>
      <span className={styles.tooltip} role="tooltip">
        {description}
      </span>
    </span>
  );
}

function normalizeCommuteMinutes(value: string) {
  return value.replace(/[^\d]/g, "");
}

type CommuteMinutesFieldProps = {
  result: ResultListItem;
  status: CommuteSaveStatus | undefined;
  saveCommuteMinutes: (result: ResultListItem, commuteMinutes: number) => Promise<boolean>;
};

function CommuteMinutesField({ result, status, saveCommuteMinutes }: CommuteMinutesFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [commuteMinutes, setCommuteMinutes] = useState("");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const isCommittingRef = useRef(false);
  const isSaving = status === "saving";
  const currentMinutes = result.commute?.commute_minutes ?? null;
  const roundTripMinutes = currentMinutes === null ? null : currentMinutes * 2;

  function startEditing() {
    setCommuteMinutes(currentMinutes === null ? "" : String(currentMinutes));
    setValidationMessage(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setCommuteMinutes("");
    setValidationMessage(null);
  }

  async function commitEditing() {
    if (isCommittingRef.current || isSaving) {
      return;
    }

    const parsedMinutes = commuteMinutesSchema.safeParse(commuteMinutes);

    if (!parsedMinutes.success) {
      setValidationMessage(getSchemaError(commuteMinutesSchema, commuteMinutes));
      return;
    }

    const nextMinutes = parsedMinutes.data;

    if (currentMinutes === nextMinutes) {
      cancelEditing();
      return;
    }

    isCommittingRef.current = true;
    const saved = await saveCommuteMinutes(result, nextMinutes);
    isCommittingRef.current = false;

    if (saved) {
      cancelEditing();
      return;
    }

    setValidationMessage("保存に失敗しました。もう一度お試しください。");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      void commitEditing();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelEditing();
    }
  }

  if (isEditing) {
    return (
      <div>
        <div className={styles.commuteEditField}>
          <span className={styles.commuteInputLabel}>片道</span>
          <Input
            className={styles.commuteInput}
            type="number"
            inputMode="numeric"
            min={0}
            max={MAX_COMMUTE_MINUTES}
            step={1}
            value={commuteMinutes}
            disabled={isSaving}
            aria-label={`${result.workplace.name}と${result.residence.name}の片道通勤時間`}
            aria-invalid={Boolean(validationMessage)}
            aria-describedby={validationMessage ? `${result.id}-commute-error` : undefined}
            onChange={(event) => {
              setValidationMessage(null);
              setCommuteMinutes(normalizeCommuteMinutes(event.target.value));
            }}
            onBlur={() => void commitEditing()}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <span className={styles.minutesUnit}>分</span>
          <SaveStatusIcon status={status} />
        </div>
        {validationMessage ? (
          <p id={`${result.id}-commute-error`} className={styles.commuteFieldError}>
            {validationMessage}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.commuteDisplayButton}
      onClick={startEditing}
      aria-label={`${result.workplace.name}と${result.residence.name}の片道通勤時間を編集`}
      disabled={isSaving}
    >
      {currentMinutes === null ? (
        <span>片道通勤時間を入力</span>
      ) : (
        <span className={styles.commuteMinutesText}>
          <span>片道{currentMinutes}分</span>
          <span className={styles.roundTripMinutes}>往復{roundTripMinutes}分</span>
        </span>
      )}
      <Pencil className={styles.editIcon} aria-hidden="true" size={15} />
      <SaveStatusIcon status={status} />
    </button>
  );
}

export function ResultList({
  results,
  sortKey,
  setSortKey,
  householdSize,
  setHouseholdSize,
  commuteSaveStatuses,
  saveCommuteMinutes,
  isLoading,
  errorMessage,
}: ResultListProps) {
  const isEmpty = !isLoading && results.length === 0;

  return (
    <section className={styles.hero} aria-labelledby="result-list-title">
      <h1 id="result-list-title" className={styles.visuallyHidden}>
        結果一覧画面
      </h1>

      <div className={styles.headerArea}>
        <div className={styles.controlGroup}>
          <div className={styles.controlField}>
            <label htmlFor="household-size" className={styles.controlLabel}>
              世帯人数
            </label>
            <Select
              value={householdSize}
              onValueChange={(value) => setHouseholdSize(value as HouseholdSize)}
            >
              <SelectTrigger id="household-size" className={styles.controlSelect}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">1人</SelectItem>
                <SelectItem value="two" disabled>
                  2人（今後対応）
                </SelectItem>
                <SelectItem value="three" disabled>
                  3人（今後対応）
                </SelectItem>
                <SelectItem value="fourOrMore" disabled>
                  4人以上（今後対応）
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={styles.controlField}>
            <label htmlFor="result-sort" className={styles.controlLabel}>
              並び順
            </label>
            <Select value={sortKey} onValueChange={(value) => setSortKey(value as ResultSortKey)}>
              <SelectTrigger id="result-sort" className={styles.controlSelect}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthlySurplus">月の収支がよい順</SelectItem>
                <SelectItem value="commuteMinutes">通勤時間が短い順</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            </div>

            <div className={styles.infoRow}>
              <Coins className={styles.icon} aria-hidden="true" size={20} />
              <p className={styles.monthlySurplusText}>
                <span className={styles.metricLabel}>
                  月の収支
                  <MonthlySurplusHelp />
                </span>
                <span className={styles.inlineValue}>
                  {formatMonthlySurplus(result.monthlySurplus)}
                </span>
              </p>
            </div>

            <div className={styles.infoRow}>
              <Clock className={styles.icon} aria-hidden="true" size={20} />
              <CommuteMinutesField
                result={result}
                status={commuteSaveStatuses[result.id]}
                saveCommuteMinutes={saveCommuteMinutes}
              />
            </div>

            <div className={styles.infoRow}>
              <StatusIcon status={result.status} />
              <p className={styles.statusText}>{result.status}</p>
            </div>
          </article>
        ))}
      </div>

      {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}

      <div className={cn(styles.actions, isEmpty && styles.emptyActions)}>
        <Button asChild>
          <Link to="/workplaces">勤務先一覧</Link>
        </Button>
        <Button asChild>
          <Link to="/residences">住居一覧</Link>
        </Button>
      </div>
    </section>
  );
}
