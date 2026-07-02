"use client";

import { useHeists } from "@/hooks/useHeists";
import HeistCard, { HeistCardSkeleton } from "@/components/HeistCard";
import styles from "./heists.module.css";

export default function HeistsPage() {
  const { heists: activeHeists, loading: activeLoading } = useHeists("active");
  const { heists: assignedHeists, loading: assignedLoading } =
    useHeists("assigned-by-me");
  const { heists: expiredHeists, loading: expiredLoading } =
    useHeists("expired");

  return (
    <div className="page-content">
      <div>
        <h2 className={styles.sectionHeading}>Your Active Heists</h2>
        {activeLoading ? (
          <div className={styles.grid}>
            <HeistCardSkeleton />
            <HeistCardSkeleton />
            <HeistCardSkeleton />
          </div>
        ) : activeHeists.length === 0 ? (
          <p className={styles.emptyState}>No active heists yet.</p>
        ) : (
          <div className={styles.grid}>
            {activeHeists.map((h) => (
              <HeistCard key={h.id} heist={h} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className={styles.sectionHeading}>Heists You&apos;ve Assigned</h2>
        {assignedLoading ? (
          <div className={styles.grid}>
            <HeistCardSkeleton />
            <HeistCardSkeleton />
            <HeistCardSkeleton />
          </div>
        ) : assignedHeists.length === 0 ? (
          <p className={styles.emptyState}>No assigned heists yet.</p>
        ) : (
          <div className={styles.grid}>
            {assignedHeists.map((h) => (
              <HeistCard key={h.id} heist={h} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className={styles.sectionHeading}>All Expired Heists</h2>
        {expiredLoading ? (
          <p className={styles.emptyState}>Loading…</p>
        ) : expiredHeists.length === 0 ? (
          <p className={styles.emptyState}>No expired heists yet.</p>
        ) : (
          <ul>
            {expiredHeists.map((h) => (
              <li key={h.id}>{h.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
