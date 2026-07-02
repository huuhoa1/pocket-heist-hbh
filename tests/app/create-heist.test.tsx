import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockPush = vi.fn();

vi.mock("@/hooks/useUser", () => ({
  useUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/db", () => ({ default: {} }));

vi.mock("firebase/firestore", () => ({
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  collection: vi.fn(() => "collection-ref"),
  serverTimestamp: vi.fn(() => "SERVER_TIMESTAMP"),
  Timestamp: {
    fromDate: vi.fn((date: Date) => ({
      seconds: Math.floor(date.getTime() / 1000),
    })),
  },
}));

import CreateHeistPage from "@/app/(dashboard)/heists/create/page";
import { useUser } from "@/hooks/useUser";
import { getDocs, addDoc } from "firebase/firestore";

const mockUseUser = vi.mocked(useUser);
const mockGetDocs = vi.mocked(getDocs);
const mockAddDoc = vi.mocked(addDoc);

const fakeUsers = [
  { id: "user-1", data: () => ({ id: "user-1", codename: "IronFoxVault" }) },
  {
    id: "user-2",
    data: () => ({ id: "user-2", codename: "SilentRavenCache" }),
  },
];

describe("CreateHeistPage", () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({
      user: { uid: "user-1" } as never,
      uid: "user-1",
      displayName: "IronFoxVault",
      email: null,
      loading: false,
    });
    mockGetDocs.mockResolvedValue({ docs: fakeUsers } as never);
    mockAddDoc.mockResolvedValue({ id: "new-heist-id" } as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders title, description, and assignee fields", async () => {
    render(<CreateHeistPage />);
    expect(screen.getByLabelText(/mission title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/briefing/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assign target/i)).toBeInTheDocument();
  });

  it("populates the assignee dropdown from the users collection", async () => {
    render(<CreateHeistPage />);
    expect(
      await screen.findByRole("option", { name: "IronFoxVault" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "SilentRavenCache" }),
    ).toBeInTheDocument();
  });

  it("calls addDoc with the correct shape when submitted", async () => {
    const user = userEvent.setup();
    render(<CreateHeistPage />);
    await screen.findByRole("option", { name: "IronFoxVault" });

    await user.type(
      screen.getByLabelText(/mission title/i),
      "Steal the stapler",
    );
    await user.type(screen.getByLabelText(/briefing/i), "Take it from desk 4B");
    await user.click(screen.getByRole("button", { name: /launch heist/i }));

    expect(mockAddDoc).toHaveBeenCalledWith(
      "collection-ref",
      expect.objectContaining({
        title: "Steal the stapler",
        description: "Take it from desk 4B",
        finalStatus: null,
      }),
    );
  });

  it("uses serverTimestamp for createdAt and a 48h Timestamp for deadline", async () => {
    const user = userEvent.setup();
    render(<CreateHeistPage />);
    await screen.findByRole("option", { name: "IronFoxVault" });

    await user.type(screen.getByLabelText(/mission title/i), "Test heist");
    await user.type(screen.getByLabelText(/briefing/i), "Test briefing");
    await user.click(screen.getByRole("button", { name: /launch heist/i }));

    const submitted = mockAddDoc.mock.calls[0][1] as Record<string, unknown>;
    expect(submitted.createdAt).toBe("SERVER_TIMESTAMP");
    const deadlineSeconds = (submitted.deadline as { seconds: number }).seconds;
    const expectedSeconds = Math.floor(
      (Date.now() + 48 * 60 * 60 * 1000) / 1000,
    );
    expect(Math.abs(deadlineSeconds - expectedSeconds)).toBeLessThan(5);
  });

  it("sources createdBy and createdByCodename from the authenticated user", async () => {
    const user = userEvent.setup();
    render(<CreateHeistPage />);
    await screen.findByRole("option", { name: "IronFoxVault" });

    await user.type(screen.getByLabelText(/mission title/i), "Test heist");
    await user.type(screen.getByLabelText(/briefing/i), "Test briefing");
    await user.click(screen.getByRole("button", { name: /launch heist/i }));

    expect(mockAddDoc).toHaveBeenCalledWith(
      "collection-ref",
      expect.objectContaining({
        createdBy: "user-1",
        createdByCodename: "IronFoxVault",
      }),
    );
  });

  it("calls router.push('/heists') after a successful submit", async () => {
    const user = userEvent.setup();
    render(<CreateHeistPage />);
    await screen.findByRole("option", { name: "IronFoxVault" });

    await user.type(screen.getByLabelText(/mission title/i), "Test heist");
    await user.type(screen.getByLabelText(/briefing/i), "Test briefing");
    await user.click(screen.getByRole("button", { name: /launch heist/i }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/heists"));
  });

  it("displays an error message when addDoc rejects", async () => {
    const user = userEvent.setup();
    mockAddDoc.mockRejectedValue(new Error("Permission denied."));
    render(<CreateHeistPage />);
    await screen.findByRole("option", { name: "IronFoxVault" });

    await user.type(screen.getByLabelText(/mission title/i), "Test heist");
    await user.type(screen.getByLabelText(/briefing/i), "Test briefing");
    await user.click(screen.getByRole("button", { name: /launch heist/i }));

    expect(await screen.findByText("Permission denied.")).toBeInTheDocument();
  });

  it("disables the submit button while submitting", async () => {
    const user = userEvent.setup();
    let resolve!: (value: unknown) => void;
    mockAddDoc.mockImplementation(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    render(<CreateHeistPage />);
    await screen.findByRole("option", { name: "IronFoxVault" });

    await user.type(screen.getByLabelText(/mission title/i), "Test heist");
    await user.type(screen.getByLabelText(/briefing/i), "Test briefing");
    await user.click(screen.getByRole("button", { name: /launch heist/i }));

    expect(screen.getByRole("button", { name: /planning/i })).toBeDisabled();
    resolve(undefined);
  });
});
