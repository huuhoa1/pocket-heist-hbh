import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Badge, { BadgeShowcase } from "@/components/Badge";

describe("Badge", () => {
  it("renders the emoji and label text", () => {
    render(<Badge emoji="🏆" label="Top Stapler Thief" />);
    expect(screen.getByText(/Top Stapler Thief/)).toBeInTheDocument();
    expect(screen.getByText(/🏆/)).toBeInTheDocument();
  });
});

describe("BadgeShowcase", () => {
  it("renders at least 4 badge elements", () => {
    const { container } = render(<BadgeShowcase />);
    const badges = container.querySelectorAll("[class*='_badge_']");
    expect(badges.length).toBeGreaterThanOrEqual(4);
  });
});
