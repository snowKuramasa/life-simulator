import styles from "@/styles/common/layout/appHeader.module.css";

type AppHeaderProps = {
  appName?: string;
  subtitle?: string;
};

export function AppHeader({
  appName = "住みかとしごと",
  subtitle = "これからの暮らしを、少し具体的に。",
}: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <p className={styles.appName}>{appName}</p>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </header>
  );
}
