import type { ReactNode } from "react";

import styles from "@/styles/common/layout/appHeader.module.css";

type AppHeaderProps = {
  appName?: string;
  subtitle?: string;
  action?: ReactNode;
};

export function AppHeader({
  appName = "さきミル",
  subtitle = "これからの暮らしを、少し具体的に。",
  action,
}: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <p className={styles.appName}>{appName}</p>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </header>
  );
}
