import styles from "./Badge.module.css";

interface Props {
  emoji: string;
  label: string;
}

export default function Badge({ emoji, label }: Props) {
  return (
    <span className={styles.badge}>
      {emoji} {label}
    </span>
  );
}
