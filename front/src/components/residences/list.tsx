import residenceImage from "@/assets/12.png";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { Button } from "@/components/common/baseUi/Button";
import { Image } from "@/components/common/baseUi/Image";
import { cn } from "@/lib/utils";
import type { Residence } from "@/types";
import { Home, MapPin, Pencil, Plus, ReceiptText, Trash2 } from "lucide-react";
import { Link } from "react-router";

import styles from "./list.module.css";

type ResidenceListProps = {
  residences: Residence[];
  isLoading: boolean;
  deletingId: number | null;
  message: string | null;
  errorMessage: string | null;
  handleDelete: (id: number) => Promise<void>;
};

function formatRent(rent: number) {
  if (rent % 10_000 === 0) {
    return `${rent / 10_000}万円`;
  }

  return `${rent.toLocaleString()}円`;
}

export function ResidenceList({
  residences,
  isLoading,
  deletingId,
  message,
  errorMessage,
  handleDelete,
}: ResidenceListProps) {
  const isEmpty = !isLoading && residences.length === 0;

  return (
    <section className={styles.hero} aria-labelledby="residence-list-title">
      <h1 id="residence-list-title" className={styles.visuallyHidden}>
        住居一覧画面
      </h1>

      <div className={styles.headerArea}>
        <div aria-hidden="true" />
        <Image
          src={residenceImage}
          alt="ソファに座っている人のイラスト"
          width={{ base: 96, md: 150 }}
          height={{ base: 96, md: 150 }}
        />
      </div>

      <div className={styles.list} aria-live="polite">
        {isLoading ? <p className={styles.statusMessage}>住居を読み込んでいます。</p> : null}
        {!isLoading && residences.length === 0 ? (
          <p className={styles.statusMessage}>住居がまだ登録されていません。</p>
        ) : null}

        {residences.map((residence) => (
          <article key={residence.id} className={styles.card}>
            <DeleteConfirmDialog
              dataName={residence.name}
              isDeleting={deletingId === residence.id}
              onConfirm={() => handleDelete(residence.id)}
              trigger={
                <button
                  type="button"
                  className={styles.deleteButton}
                  aria-label={`${residence.name}を削除`}
                  disabled={deletingId === residence.id}
                >
                  <Trash2 aria-hidden="true" size={18} strokeWidth={2.1} />
                </button>
              }
            />

            <div className={styles.row}>
              <Home className={styles.icon} aria-hidden="true" size={19} />
              <div>
                <p className={styles.label}>住居名</p>
                <p className={styles.value}>{residence.name}</p>
              </div>
            </div>

            <div className={styles.row}>
              <ReceiptText className={styles.icon} aria-hidden="true" size={19} />
              <div>
                <p className={styles.label}>家賃</p>
                <p className={styles.value}>{formatRent(residence.rent)}</p>
              </div>
            </div>

            <div className={styles.row}>
              <MapPin className={styles.icon} aria-hidden="true" size={19} />
              <div>
                <p className={styles.label}>場所</p>
                <p className={styles.value}>
                  {residence.prefecture}
                  {residence.city}
                </p>
              </div>
            </div>

            <Link
              to={`/residences/${residence.id}/edit`}
              className={styles.editLink}
              aria-label={`${residence.name}を編集`}
            >
              <Pencil aria-hidden="true" size={19} strokeWidth={2} />
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
          <Link to="/residences/new">
            <Plus aria-hidden="true" size={15} />
            住居追加
          </Link>
        </Button>
      </div>
    </section>
  );
}
