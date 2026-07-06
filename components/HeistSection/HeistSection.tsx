import { Heist } from "@/types/firestore";
import HeistCard, { HeistCardSkeleton } from "@/components/HeistCard";
import styles from "@/app/(dashboard)/heists/heists.module.css";

const SKELETON_COUNT = 3;

interface Props {
  heading: string;
  loading: boolean;
  heists: Heist[];
  emptyMessage: string;
}

export function HeistSection({
  heading,
  loading,
  heists,
  emptyMessage,
}: Props) {
  return (
    <div>
      <h2 className={styles.sectionHeading}>{heading}</h2>
      {loading ? (
        <ul className={styles.grid} aria-busy="true" aria-label="Loading">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <li key={i}>
              <HeistCardSkeleton />
            </li>
          ))}
        </ul>
      ) : heists.length === 0 ? (
        <p className={styles.emptyState}>{emptyMessage}</p>
      ) : (
        <ul className={styles.grid}>
          {heists.map((heist) => (
            <li key={heist.id}>
              <HeistCard heist={heist} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
