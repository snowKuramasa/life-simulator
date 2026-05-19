import styles from "@/styles/common/layout/appHeader.module.css";

type AppHeaderProps = {
  appName?: string;
};

export function AppHeader({ appName = "アプリ名" }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <p className={styles.appName}>{appName}</p>
    </header>
  );
}
