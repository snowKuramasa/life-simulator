import residenceImage from "@/assets/12.png";
import { Button } from "@/components/common/baseUi/Button";
import { Image } from "@/components/common/baseUi/Image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PREFECTURES } from "@/constants/prefectures";
import { type FormEvent } from "react";
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
  return value.replace(/[^\d]/g, "");
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
  submitLabel,
  submittingLabel,
  isSubmitting,
  message,
  errorMessage,
  handleSubmit,
}: ResidenceFormProps) {
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

      <form id={formId} className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <Label className={styles.label} htmlFor={`${formId}-name`}>
            住居名
          </Label>
          <Input
            id={`${formId}-name`}
            className={styles.input}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={50}
            required
          />
        </div>
        <div className={styles.field}>
          <Label className={styles.label} htmlFor={`${formId}-rent`}>
            家賃
          </Label>
          <div className={styles.rentInputGroup}>
            <Input
              id={`${formId}-rent`}
              className={styles.rentInput}
              type="text"
              value={formatRent(rent)}
              onChange={(event) => setRent(normalizeRent(event.target.value))}
              inputMode="numeric"
              required
            />
            <span className={styles.rentUnit}>円</span>
          </div>
        </div>
        <div className={styles.field}>
          <Label className={styles.label} htmlFor={`${formId}-prefecture`}>
            場所（都道府県）
          </Label>
          <Select value={prefecture} onValueChange={setPrefecture} required>
            <SelectTrigger id={`${formId}-prefecture`} className={styles.select}>
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
            maxLength={50}
            required
          />
        </div>
      </form>

      <div className={styles.actions}>
        <Button asChild className={styles.backButton}>
          <Link to="/">戻る</Link>
        </Button>
        <Button type="submit" form={formId} className={styles.saveButton} disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>

      {message ? <p className={styles.successMessage}>{message}</p> : null}
      {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}
    </section>
  );
}
