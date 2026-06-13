import workplaceImage from "@/assets/113.png";
import { RequiredBadge } from "@/components/common/RequiredBadge";
import { Button } from "@/components/common/baseUi/Button";
import { Image } from "@/components/common/baseUi/Image";
import { Input } from "@/components/common/baseUi/Input";
import { Label } from "@/components/common/baseUi/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/baseUi/Select";
import { PREFECTURES } from "@/constants/prefectures";
import { MAX_CITY_LENGTH, MAX_NAME_LENGTH, MAX_SALARY } from "@/constants/validation";
import { type FormEvent, useState } from "react";
import { Link } from "react-router";

import styles from "./form.module.css";

type WorkplaceFormProps = {
  title: string;
  formId: string;
  name: string;
  setName: (name: string) => void;
  salary: string;
  setSalary: (salary: string) => void;
  prefecture: string;
  setPrefecture: (prefecture: string) => void;
  city: string;
  setCity: (city: string) => void;
  showStepLabel?: boolean;
  backTo?: string;
  submitLabel: string;
  submittingLabel: string;
  isSubmitting: boolean;
  message: string | null;
  errorMessage: string | null;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

function formatSalary(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function normalizeSalary(value: string) {
  const digits = value.replace(/[^\d]/g, "");

  if (!digits) {
    return "";
  }

  const amount = Number(digits);

  if (!Number.isSafeInteger(amount) || amount > MAX_SALARY) {
    return String(MAX_SALARY);
  }

  return digits;
}

type RequiredField = "name" | "salary" | "prefecture";

const REQUIRED_FIELD_LABELS: Record<RequiredField, string> = {
  name: "勤務先",
  salary: "給与（手取り）",
  prefecture: "勤務地（都道府県）",
};

function getRequiredError(label: string, value: string) {
  return value.trim() ? null : `${label}は必須です`;
}

function getSalaryError(value: string) {
  const requiredError = getRequiredError(REQUIRED_FIELD_LABELS.salary, value);

  if (requiredError) {
    return requiredError;
  }

  return Number(value) <= MAX_SALARY
    ? null
    : `給与（手取り）は${MAX_SALARY.toLocaleString()}円以下で入力してください`;
}

export function WorkplaceForm({
  title,
  formId,
  name,
  setName,
  salary,
  setSalary,
  prefecture,
  setPrefecture,
  city,
  setCity,
  showStepLabel = false,
  backTo = "/",
  submitLabel,
  submittingLabel,
  isSubmitting,
  message,
  errorMessage,
  handleSubmit,
}: WorkplaceFormProps) {
  const [touchedFields, setTouchedFields] = useState<Partial<Record<RequiredField, boolean>>>({});
  const requiredErrors: Record<RequiredField, string | null> = {
    name: getRequiredError(REQUIRED_FIELD_LABELS.name, name),
    salary: getSalaryError(salary),
    prefecture: getRequiredError(REQUIRED_FIELD_LABELS.prefecture, prefecture),
  };
  const visibleErrors = {
    name: touchedFields.name ? requiredErrors.name : null,
    salary: touchedFields.salary ? requiredErrors.salary : null,
    prefecture: touchedFields.prefecture ? requiredErrors.prefecture : null,
  };
  const isFormValid = Object.values(requiredErrors).every((error) => error === null);

  function markTouched(field: RequiredField) {
    setTouchedFields((fields) => ({ ...fields, [field]: true }));
  }

  function markAllTouched() {
    setTouchedFields({
      name: true,
      salary: true,
      prefecture: true,
    });
  }

  async function handleValidatedSubmit(event: FormEvent<HTMLFormElement>) {
    if (!isFormValid) {
      event.preventDefault();
      markAllTouched();
      return;
    }

    await handleSubmit(event);
  }

  return (
    <section className={styles.hero} aria-labelledby={`${formId}-title`}>
      <h1 id={`${formId}-title`} className={styles.visuallyHidden}>
        {title}
      </h1>
      <Image
        src={workplaceImage}
        alt="駅の改札に立っている人のイラスト"
        width={{ base: 170, md: 250 }}
        height={{ base: 170, md: 250 }}
      />

      {showStepLabel ? <p className={styles.stepLabel}>ステップ1/2</p> : null}

      <form id={formId} className={styles.form} onSubmit={handleValidatedSubmit} noValidate>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <Label className={styles.label} htmlFor={`${formId}-name`}>
              勤務先
            </Label>
            <RequiredBadge />
          </div>
          <Input
            id={`${formId}-name`}
            className={styles.input}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => markTouched("name")}
            maxLength={MAX_NAME_LENGTH}
            aria-required="true"
            aria-invalid={Boolean(visibleErrors.name)}
            aria-describedby={visibleErrors.name ? `${formId}-name-error` : undefined}
          />
          {visibleErrors.name ? (
            <p id={`${formId}-name-error`} className={styles.fieldError}>
              {visibleErrors.name}
            </p>
          ) : null}
        </div>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <Label className={styles.label} htmlFor={`${formId}-salary`}>
              給与（手取り）
            </Label>
            <RequiredBadge />
          </div>
          <div className={styles.salaryInputGroup}>
            <Input
              id={`${formId}-salary`}
              className={styles.salaryInput}
              type="text"
              value={formatSalary(salary)}
              onChange={(event) => setSalary(normalizeSalary(event.target.value))}
              onBlur={() => markTouched("salary")}
              inputMode="numeric"
              maxLength={MAX_SALARY.toLocaleString().length}
              aria-required="true"
              aria-invalid={Boolean(visibleErrors.salary)}
              aria-describedby={visibleErrors.salary ? `${formId}-salary-error` : undefined}
            />
            <span className={styles.salaryUnit}>円</span>
          </div>
          {visibleErrors.salary ? (
            <p id={`${formId}-salary-error`} className={styles.fieldError}>
              {visibleErrors.salary}
            </p>
          ) : null}
        </div>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <Label className={styles.label} htmlFor={`${formId}-prefecture`}>
              勤務地（都道府県）
            </Label>
            <RequiredBadge />
          </div>
          <Select value={prefecture} onValueChange={setPrefecture}>
            <SelectTrigger
              id={`${formId}-prefecture`}
              className={styles.select}
              onBlur={() => markTouched("prefecture")}
              aria-required="true"
              aria-invalid={Boolean(visibleErrors.prefecture)}
              aria-describedby={
                visibleErrors.prefecture ? `${formId}-prefecture-error` : undefined
              }
            >
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {PREFECTURES.map((prefectureName) => (
                <SelectItem key={prefectureName} value={prefectureName}>
                  {prefectureName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {visibleErrors.prefecture ? (
            <p id={`${formId}-prefecture-error`} className={styles.fieldError}>
              {visibleErrors.prefecture}
            </p>
          ) : null}
        </div>
        <div className={styles.field}>
          <Label className={styles.label} htmlFor={`${formId}-city`}>
            勤務地（市区町村）
          </Label>
          <Input
            id={`${formId}-city`}
            className={styles.input}
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            maxLength={MAX_CITY_LENGTH}
          />
        </div>
      </form>

      <div className={styles.actions}>
        <Button asChild className={styles.backButton}>
          <Link to={backTo}>戻る</Link>
        </Button>
        <Button
          type="submit"
          form={formId}
          className={styles.saveButton}
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>

      {message ? <p className={styles.successMessage}>{message}</p> : null}
      {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}
    </section>
  );
}
