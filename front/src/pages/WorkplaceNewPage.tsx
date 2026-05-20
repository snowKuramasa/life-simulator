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
import { useWorkplaceNewPage } from "@/hooks/useWorkplaceNewPage";
import { Link } from "react-router";

import styles from "./WorkplaceNewPage.module.css";

function formatSalary(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function normalizeSalary(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function WorkplaceNewPage() {
  const {
    name,
    setName,
    salary,
    setSalary,
    prefecture,
    setPrefecture,
    city,
    setCity,
    isInitialFlow,
    isSubmitting,
    message,
    errorMessage,
    handleSubmit,
  } = useWorkplaceNewPage();

  return (
    <section className={styles.hero} aria-labelledby="workplace-new-page-title">
      <h1 id="workplace-new-page-title" className={styles.visuallyHidden}>
        勤務先新規作成画面
      </h1>
      <Image
        src={workplaceImage}
        alt="駅の改札に立っている人のイラスト"
        width={{ base: 210, md: 312 }}
        height={{ base: 210, md: 312 }}
      />

      {isInitialFlow ? <p className={styles.stepLabel}>ステップ1/2</p> : null}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <Label className={styles.label} htmlFor="workplace-name">
            勤務先
          </Label>
          <Input
            id="workplace-name"
            className={styles.input}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={50}
            required
          />
        </div>
        <div className={styles.field}>
          <Label className={styles.label} htmlFor="workplace-salary">
            給与（手取り）
          </Label>
          <div className={styles.salaryInputGroup}>
            <Input
              id="workplace-salary"
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
          <Label className={styles.label} htmlFor="workplace-prefecture">
            勤務地（都道府県）
          </Label>
          <Select value={prefecture} onValueChange={setPrefecture} required>
            <SelectTrigger id="workplace-prefecture" className={styles.select}>
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
          <Label className={styles.label} htmlFor="workplace-city">
            勤務地（市区町村）
          </Label>
          <Input
            id="workplace-city"
            className={styles.input}
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            maxLength={50}
            required
          />
        </div>

        <div className={styles.actions}>
          <Button asChild className={styles.backButton}>
            <Link to="/">戻る</Link>
          </Button>
          <Button type="submit" className={styles.saveButton} disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : isInitialFlow ? "次へ" : "保存"}
          </Button>
        </div>
      </form>

      {message ? <p className={styles.successMessage}>{message}</p> : null}
      {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}
    </section>
  );
}
