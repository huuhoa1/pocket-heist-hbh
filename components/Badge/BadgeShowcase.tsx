import Badge from "./Badge";
import styles from "./Badge.module.css";

const BADGES = [
  { emoji: "🏆", label: "Top Stapler Thief" },
  { emoji: "🕵️", label: "Most Suspicious Coworker" },
  { emoji: "🗑️", label: "Bin Diver General" },
  { emoji: "📎", label: "Paperclip Kingpin" },
  { emoji: "☕", label: "Coffee Saboteur" },
  { emoji: "🧻", label: "Toilet Roll Hoarder" },
];

export function BadgeShowcase() {
  return (
    <div className={styles.showcase}>
      {BADGES.map(({ emoji, label }) => (
        <Badge key={label} emoji={emoji} label={label} />
      ))}
    </div>
  );
}
