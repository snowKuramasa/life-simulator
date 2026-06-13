import residenceImage from "@/assets/12.png";
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
import { MAX_CITY_LENGTH, MAX_NAME_LENGTH, MAX_RENT } from "@/constants/validation";
import { type FormEvent, useState } from "react";
import { Link } from "react-router";

import styles from "./form.module.css";

type ResidenceFormProps = {
  title: string;
  formId: string;
  name: string;
  setName: (name: string) => void;
  rent: string;
  setRent: (rent: string) => void;
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

function formatRent(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function normalizeRent(value: string) {
  const digits = value.replace(/[^\d]/g, "");

  if (!digits) {
    return "";
  }

  const amount = Number(digits);

  if (!Number.isSafeInteger(amount) || amount > MAX_RENT) {
    return String(MAX_RENT);
  }

  return digits;
}

type RequiredField = "name" | "rent" | "prefecture";

const REQUIRED_FIELD_LABELS: Record<RequiredField, string> = {
  name: "住居名",
  rent: "家賃",
  prefecture: "場所（都道府県）",
};

function getRequiredError(label: string, value: string) {
  return value.trim() ? null : `${label}は必須です`;
}

function getRentError(value: string) {
  const requiredError = getRequiredError(REQUIRED_FIELD_LABELS.rent, value);

  if (requiredError) {
    return requiredError;
  }

  return Number(value) <= MAX_RENT ? null : `家賃は${MAX_RENT.toLocaleString()}円以下で入力してください`;
}

export function ResidenceForm({
  title,
  formId,
  name,
  setName,
  rent,
  setRent,
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
}: ResidenceFormProps) {
  const [touchedFields, setTouchedFields] = useState<Partial<Record<RequiredField, boolean>>>({});
  const requiredErrors: Record<RequiredField, string | null> = {
    name: getRequiredError(REQUIRED_FIELD_LABELS.name, name),
    rent: getRentError(rent),
    prefecture: getRequiredError(REQUIRED_FIELD_LABELS.prefecture, prefecture),
  };
  const visibleErrors = {
    name: touchedFields.name ? requiredErrors.name : null,
    rent: touchedFields.rent ? requiredErrors.rent : null,
    prefecture: touchedFields.prefecture ? requiredErrors.prefecture : null,
  };
  const isFormValid = Object.values(requiredErrors).every((error) => error === null);

  function markTouched(field: RequiredField) {
    setTouchedFields((fields) => ({ ...fields, [field]: true }));
  }

  function markAllTouched() {
    setTouchedFields({
      name: true,
      rent: true,
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
        src={residenceImage}
        alt="ソファに座っている人のイラスト"
        width={{ base: 170, md: 250 }}
        height={{ base: 170, md: 250 }}
      />

      {showStepLabel ? <p className={styles.stepLabel}>ステップ2/2</p> : null}

      <form id={formId} className={styles.form} onSubmit={handleValidatedSubmit} noValidate>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <Label className={styles.label} htmlFor={`${formId}-name`}>
              住居名
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
            <Label className={styles.label} htmlFor={`${formId}-rent`}>
              家賃
            </Label>
            <RequiredBadge />
          </div>
          <div className={styles.rentInputGroup}>
            <Input
              id={`${formId}-rent`}
              className={styles.rentInput}
              type="text"
              value={formatRent(rent)}
              onChange={(event) => setRent(normalizeRent(event.target.value))}
              onBlur={() => markTouched("rent")}
              inputMode="numeric"
              maxLength={MAX_RENT.toLocaleString().length}
              aria-required="true"
              aria-invalid={Boolean(visibleErrors.rent)}
              aria-describedby={visibleErrors.rent ? `${formId}-rent-error` : undefined}
            />
            <span className={styles.rentUnit}>円</span>
          </div>
          {visibleErrors.rent ? (
            <p id={`${formId}-rent-error`} className={styles.fieldError}>
              {visibleErrors.rent}
            </p>
          ) : null}
        </div>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <Label className={styles.label} htmlFor={`${formId}-prefecture`}>
              場所（都道府県）
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
            場所（市区町村）
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
