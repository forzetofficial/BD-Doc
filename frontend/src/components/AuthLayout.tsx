import styles from "./AuthLayout.module.css";
import { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
};

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className={styles["login-page"]}>
      <div className={styles["bg-mesh"]} aria-hidden="true" />
      <div className={`${styles.orb} ${styles.violet} ${styles.one}`} />
      <div className={`${styles.orb} ${styles.blue} ${styles.two}`} />
      <div className={`${styles.orb} ${styles.green} ${styles.three}`} />
      <div className={`${styles.orb} ${styles.yellow} ${styles.four}`} />
      <div className={styles.particles} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className={styles.card}>
        <div className={styles.title}>{title}</div>
        {children}
      </div>
    </div>
  );
}
