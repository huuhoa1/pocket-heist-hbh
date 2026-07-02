import Link from "next/link";
import { Clock8 } from "lucide-react";
import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={styles.splash}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Mission Briefing</p>
        <h1 className={styles.title}>
          P<Clock8 className={styles.logo} strokeWidth={2.75} />
          cket Heist
        </h1>
        <p className={styles.tagline}>Chaos, but make it corporate.</p>
      </div>

      <div className={styles.specs}>
        <div className={styles.spec}>
          <span className={styles.specLabel}>Deadline</span>
          <span className={styles.specValue}>48 Hours</span>
        </div>
        <div className={styles.specDivider} />
        <div className={styles.spec}>
          <span className={styles.specLabel}>Your Target</span>
          <span className={styles.specValue}>A Coworker</span>
        </div>
        <div className={styles.specDivider} />
        <div className={styles.spec}>
          <span className={styles.specLabel}>Stakes</span>
          <span className={styles.specValue}>Office Glory</span>
        </div>
      </div>

      <p className={styles.body}>
        Welcome to Pocket Heist — the app where you assign sneaky little
        missions to your coworkers and watch the chaos unfold. Complete missions
        to climb the leaderboard and cement your legacy as the most diabolical
        desk jockey in the office.
      </p>

      <div className={styles.actions}>
        <Link href="/signup" className="btn">
          Register — Start Your First Mission
        </Link>
        <p className={styles.loginPrompt}>
          Already an operative?{" "}
          <Link href="/login" className={styles.loginLink}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
