import startImage from "@/assets/welcome.png";
import { Button } from "@/components/common/baseUi/Button";
import { Image } from "@/components/common/baseUi/Image";
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
        alt="飲み物を持って窓辺で過ごす人のイラスト"
        width={{ base: 250, md: 410 }}
        height={{ base: 250, md: 410 }}
      />
      <p className={styles.appName}>mitooshi</p>
      <p className={styles.description}>
        住まいとお金から、暮らしを考える
      </p>
      <Button asChild className={styles.startButton}>
        <Link to="/login">はじめる</Link>
      </Button>
    </section>
  );
}
