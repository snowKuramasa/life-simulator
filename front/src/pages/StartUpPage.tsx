import startImage from "@/assets/90.png";
import { Button } from "@/components/common/atom/Button";
import { Image } from "@/components/common/atom/Image";
import { Link } from "react-router";

import styles from "./StartUpPage.module.css";

// 利用開始画面です。
export function StartUpPage() {
  return (
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
      <Button asChild className={styles.startButton}>
        <Link to="/login">はじめる</Link>
      </Button>
    </section>
  );
}
