"use client";

import { useHeists } from "@/hooks/useHeists";
import { HeistSection } from "@/components/HeistSection";

export default function HeistsPage() {
  const { heists: activeHeists, loading: activeLoading } = useHeists("active");
  const { heists: assignedHeists, loading: assignedLoading } =
    useHeists("assigned-by-me");
  const { heists: expiredHeists, loading: expiredLoading } =
    useHeists("expired");

  return (
    <div className="page-content">
      <HeistSection
        heading="Your Active Heists"
        loading={activeLoading}
        heists={activeHeists}
        emptyMessage="No active heists yet."
      />
      <HeistSection
        heading="Heists You've Assigned"
        loading={assignedLoading}
        heists={assignedHeists}
        emptyMessage="No assigned heists yet."
      />
      <HeistSection
        heading="All Expired Heists"
        loading={expiredLoading}
        heists={expiredHeists}
        emptyMessage="No expired heists yet."
      />
    </div>
  );
}
