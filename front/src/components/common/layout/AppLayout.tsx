import { Outlet } from "react-router";

import { AppHeader } from "@/components/common/layout/AppHeader";

import styles from "@/styles/common/layout/appLayout.module.css";

export function AppLayout() {
  return (
    <main className={styles.layout}>
      <AppHeader />
      <Outlet />
    </main>
  );
}
