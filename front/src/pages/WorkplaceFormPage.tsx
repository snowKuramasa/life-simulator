import workplaceImage from "@/assets/113.png";
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

import styles from "./WorkplaceNewPage.module.css";

type WorkplaceFormPageProps = {
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
  return value.replace(/[^\d]/g, "");
}

export function WorkplaceFormPage({
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
  submitLabel,
  submittingLabel,
  isSubmitting,
  message,
  errorMessage,
  handleSubmit,
}: WorkplaceFormPageProps) {
  return (
    <section className={styles.hero} aria-labelledby={`${formId}-title`}>
      <h1 id={`${formId}-title`} className={styles.visuallyHidden}>
        {title}
      </h1>
      <Image
        src={workplaceImage}
        alt="駅の改札に立っている人のイラスト"
        width={{ base: 210, md: 312 }}
        height={{ base: 210, md: 312 }}
      />

      {showStepLabel ? <p className={styles.stepLabel}>ステップ1/2</p> : null}

      <form id={formId} className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <Label className={styles.label} htmlFor={`${formId}-name`}>
            勤務先
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
          <Label className={styles.label} htmlFor={`${formId}-salary`}>
            給与（手取り）
          </Label>
          <div className={styles.salaryInputGroup}>
            <Input
              id={`${formId}-salary`}
              className={styles.salaryInput}
              type="text"
              value={formatSalary(salary)}
              onChange={(event) => setSalary(normalizeSalary(event.target.value))}
              inputMode="numeric"
              required
            />
            <span className={styles.salaryUnit}>円</span>
          </div>
        </div>
        <div className={styles.field}>
          <Label className={styles.label} htmlFor={`${formId}-prefecture`}>
            勤務地（都道府県）
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
            勤務地（市区町村）
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
