import Link from "next/link";
import { Heist } from "@/types/firestore";
import styles from "./HeistCard.module.css";

interface Props {
  heist: Heist;
}

export default function HeistCard({ heist }: Props) {
  const formattedDeadline = heist.deadline.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <article className={styles.card}>
      <Link href={`/heists/${heist.id}`} className={styles.title}>
        {heist.title}
      </Link>

      <div className={styles.meta}>
        <div className={styles.metaRow}>
          <span className={styles.label}>Target</span>
          <span className={styles.value}>
            {heist.assignedToCodename || heist.assignedTo}
          </span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.label}>Assigned by</span>
          <span className={styles.value}>
            {heist.createdByCodename || heist.createdBy}
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.metaRow}>
          <span className={styles.label}>Deadline</span>
          <span className={styles.value}>{formattedDeadline}</span>
        </div>
        {heist.finalStatus && (
          <span
            className={
              heist.finalStatus === "success"
                ? styles.badgeSuccess
                : styles.badgeFailure
            }
          >
            {heist.finalStatus === "success" ? "Success" : "Failure"}
          </span>
        )}
      </div>
    </article>
  );
}
