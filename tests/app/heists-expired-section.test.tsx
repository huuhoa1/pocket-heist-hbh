import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/hooks/useHeists", () => ({
  useHeists: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

import HeistsPage from "@/app/(dashboard)/heists/page";
import { useHeists } from "@/hooks/useHeists";
import { Heist } from "@/types/firestore";

const mockUseHeists = vi.mocked(useHeists);

const fakeExpiredHeist: Heist = {
  id: "h-expired",
  title: "The Great Stapler Caper",
  description: "Gone wrong",
  createdBy: "user-1",
  createdByCodename: "IronFoxVault",
  assignedTo: "user-2",
  assignedToCodename: "SilentRavenCache",
  createdAt: new Date(2024, 0, 1),
  deadline: new Date(2024, 5, 1),
  finalStatus: "failure",
};

function setupMocks({
  expiredLoading = false,
  expiredHeists = [] as Heist[],
} = {}) {
  mockUseHeists.mockImplementation((mode) => {
    if (mode === "expired")
      return { heists: expiredHeists, loading: expiredLoading };
    return { heists: [], loading: false };
  });
}

describe("HeistsPage — expired section", () => {
  it("shows 3 skeleton cards while expiredLoading is true", () => {
    setupMocks({ expiredLoading: true });
    const { container } = render(<HeistsPage />);

    const skeletons = container.querySelectorAll("[class*='_card_']");
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });

  it("shows empty state when expired array is empty", () => {
    setupMocks({ expiredHeists: [] });
    render(<HeistsPage />);

    expect(screen.getByText("No expired heists yet.")).toBeInTheDocument();
  });

  it("renders a HeistCard per expired heist", () => {
    setupMocks({ expiredHeists: [fakeExpiredHeist] });
    render(<HeistsPage />);

    expect(
      screen.getByRole("link", { name: /the great stapler caper/i }),
    ).toBeInTheDocument();
  });

  it("status badge is visible on expired cards", () => {
    setupMocks({ expiredHeists: [fakeExpiredHeist] });
    render(<HeistsPage />);

    expect(screen.getByText("Failure")).toBeInTheDocument();
  });
});
