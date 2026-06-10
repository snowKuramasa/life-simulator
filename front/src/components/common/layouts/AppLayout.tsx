import { LogOut } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router";

import { Button } from "@/components/common/baseUi/Button";
import { GuestLogoutConfirmDialog } from "@/components/common/GuestLogoutConfirmDialog";
import { AppHeader } from "@/components/common/layouts/AppHeader";
import { useAuth } from "@/hooks/useAuth";

import styles from "@/styles/common/layout/appLayout.module.css";

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoggingOut } = useAuth();
  const guestUser = user?.guest ? user : null;
  const pageKey = `${location.pathname}${location.search}`;

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <main className={styles.layout}>
      <AppHeader
        action={
          guestUser ? (
            <GuestLogoutConfirmDialog
              userName={guestUser.name}
              isLoggingOut={isLoggingOut}
              onConfirm={handleLogout}
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={styles.logoutButton}
                  aria-label="ログアウト"
                >
                  <LogOut aria-hidden="true" size={16} />
                  <span className={styles.logoutLabel}>ログアウト</span>
                </Button>
              }
            />
          ) : null
        }
      />
      <div key={pageKey} className={styles.pageContent}>
        <Outlet />
      </div>
    </main>
  );
}
