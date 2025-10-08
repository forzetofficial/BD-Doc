import styles from "../pages/Home.module.css";

export default function AppBackground() {
  return (
    <>
      <div className={styles["bg-mesh"]} aria-hidden="true" />
      <div className={styles["blur-blobs"]} aria-hidden>
        <span className={`${styles.blob} ${styles["blob-violet"]}`} />
        <span className={`${styles.blob} ${styles["blob-pink"]}`} />
        <span className={`${styles.blob} ${styles["blob-yellow"]}`} />
      </div>
    </>
  );
}
