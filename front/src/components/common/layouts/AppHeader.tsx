import type { ReactNode } from "react";

import mitooshiLogo from "@/assets/mitooshi-logo.svg";
import { Image } from "@/components/common/baseUi/Image";
import styles from "@/styles/common/layout/appHeader.module.css";

type AppHeaderProps = {
  appName?: string;
  subtitle?: string;
  action?: ReactNode;
};

export function AppHeader({
  appName,
  subtitle = "住まいとお金から、暮らしを考える",
  action,
}: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        {appName ? (
          <p className={styles.appName}>{appName}</p>
        ) : (
          <Image
            className={styles.logo}
            src={mitooshiLogo}
            alt="mitooshi"
            width={{ base: 112, md: 128 }}
            height={{ base: 27, md: 31 }}
          />
        )}
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </header>
  );
}
