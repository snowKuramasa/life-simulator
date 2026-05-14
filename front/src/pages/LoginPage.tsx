import loginImage from "@/assets/4.png";
import { Button } from "@/components/common/atom/Button";
import { Image } from "@/components/common/atom/Image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginPage } from "@/hooks/useLoginPage";
import { Link } from "react-router";

import styles from "./LoginPage.module.css";

// MVP向けのログイン画面です。
// Googleログインは本リリース予定のため、今はゲストログインだけを有効にしています。
export function LoginPage() {
  const {
    user,
    isAuthenticated,
    isAuthLoading,
    name,
    setName,
    isSubmitting,
    message,
    errorMessage,
    handleGuestLogin,
  } = useLoginPage();
  const shouldShowLoginForm = !isAuthLoading && !isAuthenticated;
  const welcomeMessage = user?.name ? `お帰りなさい ${user.name} さん` : "お帰りなさい ゲスト さん";

  return (
    <section className={styles.hero} aria-labelledby="login-page-title">
      <h1 id="login-page-title" className={styles.visuallyHidden}>
        ログイン画面
      </h1>
      <Image
        src={loginImage}
        alt="座って猫を抱いている人のイラスト"
        width={{ base: 180, md: 260 }}
        height={{ base: 180, md: 260 }}
      />

      {shouldShowLoginForm ? (
        <>
          <p className={styles.loginLabel}>ログイン</p>
          <Button type="button" className={styles.googleButton} disabled>
            <span className={styles.googleIcon} aria-hidden="true">
              G
            </span>
            Googleでログイン（準備中）
          </Button>

          <p className={styles.separator}>または・・・</p>

          <form className={styles.form} onSubmit={handleGuestLogin}>
            <p className={styles.guestTitle}>ゲストログイン</p>
            <div className={styles.nameField}>
              <Label className={styles.nameLabel} htmlFor="guest-name">
                名前
              </Label>
              <Input
                id="guest-name"
                className={styles.nameInput}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={50}
                autoComplete="name"
              />
            </div>
            <div className={styles.actions}>
              <Button asChild variant="outline" className={styles.backButton}>
                <Link to="/">戻る</Link>
              </Button>
              <Button type="submit" className={styles.guestButton} disabled={isSubmitting}>
                {isSubmitting ? "ログイン中..." : "ゲストで続ける"}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className={styles.loggedInActions}>
          <p className={styles.welcomeMessage}>{isAuthLoading ? "確認中..." : welcomeMessage}</p>
          <div className={styles.actions}>
            <Button asChild variant="outline" className={styles.backButton}>
              <Link to="/">戻る</Link>
            </Button>
            <Button asChild className={styles.guestButton}>
              <Link to="/">ゲストで続ける</Link>
            </Button>
          </div>
        </div>
      )}

      {message && shouldShowLoginForm ? <p className={styles.successMessage}>{message}</p> : null}
      {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}

      {shouldShowLoginForm ? (
        <p className={styles.note}>
          ※あとからログインできますがブラウザを変更またはCookieを削除した場合データが消えてしまいます。
        </p>
      ) : null}
    </section>
  );
}
