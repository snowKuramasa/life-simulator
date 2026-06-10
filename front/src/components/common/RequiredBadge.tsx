import styles from "./RequiredBadge.module.css";

export function RequiredBadge() {
  return (
    <span className={styles.mark} aria-label="必須">
      *
    </span>
  );
}
