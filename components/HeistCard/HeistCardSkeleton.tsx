import styles from "./HeistCard.module.css";

export function HeistCardSkeleton() {
  return (
    <article className={styles.card}>
      <div className={styles.skeletonTitle} />
      <div className={styles.meta}>
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
      </div>
      <div className={styles.skeletonLineSm} />
    </article>
  );
}
