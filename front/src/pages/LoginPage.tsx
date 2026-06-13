import loginImage from "@/assets/4.png";
import { Button } from "@/components/common/baseUi/Button";
import { Image } from "@/components/common/baseUi/Image";
import { Input } from "@/components/common/baseUi/Input";
import { Label } from "@/components/common/baseUi/Label";
import { useLoginPage } from "@/hooks/useLoginPage";
import { getFieldError, guestLoginFormSchema } from "@/lib/validation";
import { type FormEvent, useState } from "react";
import { Link } from "react-router";

import styles from "./LoginPage.module.css";

// MVP向けのログイン画面です。
// Googleログインは本リリース予定のため、今はゲストログインだけを有効にしています。
export function LoginPage() {
  const [isNameTouched, setIsNameTouched] = useState(false);
  const {
    user,
    isAuthenticated,
    isAuthLoading,
    name,
    setName,
    isSubmitting,
    message,
    errorMessage,
    continuePath,
    handleGuestLogin,
  } = useLoginPage();
  const shouldShowLoginForm = !isAuthLoading && !isAuthenticated;
  const welcomeMessage = user?.name ? `お帰りなさい ${user.name} さん` : "お帰りなさい ゲスト さん";
  const nameError = getFieldError(guestLoginFormSchema, { name }, "name");
  const visibleNameError = isNameTouched ? nameError : null;

  function handleValidatedGuestLogin(event: FormEvent<HTMLFormElement>) {
    if (nameError) {
      event.preventDefault();
      setIsNameTouched(true);
      return;
    }

    void handleGuestLogin(event);
  }

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

      {isAuthLoading ? (
        <div className={styles.loggedInActions}>
          <p className={styles.welcomeMessage}>確認中...</p>
        </div>
      ) : shouldShowLoginForm ? (
        <>
          <p className={styles.loginLabel}>ログイン</p>
          <Button type="button" className={styles.googleButton} disabled>
            <span className={styles.googleIcon} aria-hidden="true">
              G
            </span>
            Googleでログイン（準備中）
          </Button>

          <p className={styles.separator}>または・・・</p>

          <form className={styles.form} onSubmit={handleValidatedGuestLogin} noValidate>
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
                onBlur={() => setIsNameTouched(true)}
                autoComplete="name"
                aria-invalid={Boolean(visibleNameError)}
                aria-describedby={visibleNameError ? "guest-name-error" : undefined}
              />
              {visibleNameError ? (
                <p id="guest-name-error" className={styles.fieldError}>
                  {visibleNameError}
                </p>
              ) : null}
            </div>
            <div className={styles.actions}>
              <Button asChild className={styles.backButton}>
                <Link to="/">戻る</Link>
              </Button>
              <Button
                type="submit"
                className={styles.guestButton}
                disabled={isSubmitting || Boolean(nameError)}
              >
                {isSubmitting ? "ログイン中..." : "ゲストで続ける"}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className={styles.loggedInActions}>
          <p className={styles.welcomeMessage}>{welcomeMessage}</p>
          <div className={styles.actions}>
            <Button asChild className={styles.backButton}>
              <Link to="/">戻る</Link>
            </Button>
            <Button asChild className={styles.guestButton}>
              <Link to={continuePath}>ゲストで続ける</Link>
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
