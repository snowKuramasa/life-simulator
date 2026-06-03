import workplaceImage from "@/assets/113.png";
import { Button } from "@/components/common/baseUi/Button";
import { Image } from "@/components/common/baseUi/Image";
import type { Workplace } from "@/types";
import { Building2, Coins, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
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
  async function confirmAndDelete(workplace: Workplace) {
    if (!window.confirm(`${workplace.name}を削除しますか？`)) {
      return;
    }

    await handleDelete(workplace.id);
  }

  return (
    <section className={styles.hero} aria-labelledby="workplace-list-title">
      <h1 id="workplace-list-title" className={styles.visuallyHidden}>
        勤務先一覧画面
      </h1>

      <div className={styles.headerArea}>
        <Image
          src={workplaceImage}
          alt="駅の改札に立っている人のイラスト"
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
            <button
              type="button"
              className={styles.deleteButton}
              aria-label={`${workplace.name}を削除`}
              disabled={deletingId === workplace.id}
              onClick={() => void confirmAndDelete(workplace)}
            >
              <Trash2 aria-hidden="true" size={18} strokeWidth={2.1} />
            </button>

            <div className={styles.row}>
              <Building2 className={styles.icon} aria-hidden="true" size={19} />
              <div>
                <p className={styles.label}>勤務先名</p>
                <p className={styles.value}>{workplace.name}</p>
              </div>
            </div>

            <div className={styles.row}>
              <Coins className={styles.icon} aria-hidden="true" size={19} />
              <div>
                <p className={styles.label}>給与（手取り）</p>
                <p className={styles.value}>{formatSalary(workplace.salary)}</p>
              </div>
            </div>

            <div className={styles.row}>
              <MapPin className={styles.icon} aria-hidden="true" size={19} />
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
              <Pencil aria-hidden="true" size={19} strokeWidth={2} />
            </Link>

          </article>
        ))}
      </div>

      <div className={styles.actions}>
        <Button asChild className={styles.backButton}>
          <Link to="/results">戻る</Link>
        </Button>
        <Button asChild className={styles.addButton}>
          <Link to="/workplaces/new">
            <Plus aria-hidden="true" size={15} />
            勤務先追加
          </Link>
        </Button>
      </div>

      {message ? <p className={styles.successMessage}>{message}</p> : null}
      {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}
    </section>
  );
}
