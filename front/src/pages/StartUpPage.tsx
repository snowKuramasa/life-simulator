import startImage from "@/assets/90.png";
import { Button } from "@/components/common/atom/Button";
import { Image } from "@/components/common/atom/Image";
import { AppHeader } from "@/components/common/layout/AppHeader";

import styles from "./StartUpPage.module.css";

// 利用開始画面です。
export function StartUpPage() {
  return (
    <main className={styles.page}>
      <AppHeader />

      <section className={styles.hero} aria-labelledby="start-page-title">
        <h1 id="start-page-title" className={styles.visuallyHidden}>
          利用開始画面
        </h1>
        <Image
          className={styles.heroImage}
          src={startImage}
          alt="食卓で過ごす人と犬のイラスト"
          width={{ base: 250, md: 410 }}
          height={{ base: 250, md: 410 }}
        />
        <p className={styles.description}>
          生活のバランスを簡単に
          <br />
          シミュレーションできます
        </p>
        <Button type="button" className={styles.startButton}>
          はじめる
        </Button>
      </section>
    </main>
  );
}
