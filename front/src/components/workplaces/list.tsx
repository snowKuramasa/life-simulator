import workplaceImage from "@/assets/workplaces.png";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { Button } from "@/components/common/baseUi/Button";
import { Image } from "@/components/common/baseUi/Image";
import { cn } from "@/lib/utils";
import type { Workplace } from "@/types";
import { PiBuildingOffice, PiCoins, PiMapPin, PiPencilSimple, PiPlus, PiTrash } from "react-icons/pi";
import { Link } from "react-router";

import styles from "./list.module.css";

type WorkplaceListProps = {
  workplaces: Workplace[];
  isLoading: boolean;
  deletingId: number | null;
  message: string | null;
  errorMessage: string | null;
  handleDelete: (id: number) => Promise<void>;
};

function formatSalary(salary: number) {
  if (salary % 10_000 === 0) {
    return `${salary / 10_000}万円`;
  }

  return `${salary.toLocaleString()}円`;
}

export function WorkplaceList({
  workplaces,
  isLoading,
  deletingId,
  message,
  errorMessage,
  handleDelete,
}: WorkplaceListProps) {
  const isEmpty = !isLoading && workplaces.length === 0;

  return (
    <section className={styles.hero} aria-labelledby="workplace-list-title">
      <h1 id="workplace-list-title" className={styles.visuallyHidden}>
        勤務先一覧画面
      </h1>

      <div className={styles.headerArea}>
        <div aria-hidden="true" />
        <Image
          src={workplaceImage}
          alt="自動改札を通る人のイラスト"
          width={{ base: 96, md: 150 }}
          height={{ base: 96, md: 150 }}
        />
      </div>

      <div className={styles.list} aria-live="polite">
        {isLoading ? <p className={styles.statusMessage}>勤務先を読み込んでいます。</p> : null}
        {!isLoading && workplaces.length === 0 ? (
          <p className={styles.statusMessage}>勤務先がまだ登録されていません。</p>
        ) : null}

        {workplaces.map((workplace) => (
          <article key={workplace.id} className={styles.card}>
            <DeleteConfirmDialog
              dataName={workplace.name}
              isDeleting={deletingId === workplace.id}
              onConfirm={() => handleDelete(workplace.id)}
              trigger={
                <button
                  type="button"
                  className={styles.deleteButton}
                  aria-label={`${workplace.name}を削除`}
                  disabled={deletingId === workplace.id}
                >
                  <PiTrash aria-hidden="true" size={18} />
                </button>
              }
            />

            <div className={styles.row}>
              <PiBuildingOffice className={styles.icon} aria-hidden="true" size={19} />
              <div>
                <p className={styles.label}>勤務先名</p>
                <p className={styles.value}>{workplace.name}</p>
              </div>
            </div>

            <div className={styles.row}>
              <PiCoins className={styles.icon} aria-hidden="true" size={19} />
              <div>
                <p className={styles.label}>給与（手取り）</p>
                <p className={styles.value}>{formatSalary(workplace.salary)}</p>
              </div>
            </div>

            <div className={styles.row}>
              <PiMapPin className={styles.icon} aria-hidden="true" size={19} />
              <div>
                <p className={styles.label}>勤務地</p>
                <p className={styles.value}>
                  {workplace.prefecture}
                  {workplace.city}
                </p>
              </div>
            </div>

            <Link
              to={`/workplaces/${workplace.id}/edit`}
              className={styles.editLink}
              aria-label={`${workplace.name}を編集`}
            >
              <PiPencilSimple aria-hidden="true" size={19} />
            </Link>

          </article>
        ))}
      </div>

      {message ? <p className={styles.successMessage}>{message}</p> : null}
      {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}

      <div className={cn(styles.actions, isEmpty && styles.emptyActions)}>
        <Button asChild className={styles.backButton}>
          <Link to="/results">戻る</Link>
        </Button>
        <Button asChild className={styles.addButton}>
          <Link to="/workplaces/new">
            <PiPlus aria-hidden="true" size={15} />
            勤務先追加
          </Link>
        </Button>
      </div>
    </section>
  );
}
