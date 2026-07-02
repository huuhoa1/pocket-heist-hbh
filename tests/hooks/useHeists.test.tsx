import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockUnsubscribe = vi.fn();

vi.mock("@/hooks/useUser", () => ({
  useUser: vi.fn(),
}));

vi.mock("@/lib/db", () => ({ default: {} }));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => ({ withConverter: vi.fn(() => "converted-ref") })),
  query: vi.fn(() => "query-ref"),
  where: vi.fn(),
  onSnapshot: vi.fn(),
  Timestamp: { now: vi.fn(() => "ts-now") },
}));

import { useHeists } from "@/hooks/useHeists";
import { useUser } from "@/hooks/useUser";
import { onSnapshot, where } from "firebase/firestore";

const mockUseUser = vi.mocked(useUser);
const mockOnSnapshot = vi.mocked(onSnapshot);
const mockWhere = vi.mocked(where);

const fakeHeist = {
  id: "h1",
  title: "Steal the Stapler",
  description: "Take it from desk 4B",
  createdBy: "user-1",
  createdByCodename: "IronFoxVault",
  assignedTo: "user-2",
  assignedToCodename: "SilentRavenCache",
  createdAt: new Date(),
  deadline: new Date(Date.now() + 10000),
  finalStatus: "success" as const,
};

describe("useHeists", () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({
      user: { uid: "user-1" } as never,
      uid: "user-1",
      displayName: "IronFoxVault",
      email: null,
      loading: false,
    });
    mockOnSnapshot.mockImplementation((_q, callback: any) => {
      callback({ docs: [{ data: () => fakeHeist }] });
      return mockUnsubscribe;
    });
    mockWhere.mockReturnValue("where-clause" as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("queries by assignedTo and future deadline for 'active' mode", () => {
    renderHook(() => useHeists("active"));
    expect(mockWhere).toHaveBeenCalledWith("assignedTo", "==", "user-1");
    expect(mockWhere).toHaveBeenCalledWith("deadline", ">", "ts-now");
  });

  it("queries by createdBy and future deadline for 'assigned-by-me' mode", () => {
    renderHook(() => useHeists("assigned-by-me"));
    expect(mockWhere).toHaveBeenCalledWith("createdBy", "==", "user-1");
    expect(mockWhere).toHaveBeenCalledWith("deadline", ">", "ts-now");
  });

  it("queries by past deadline for 'expired' mode", () => {
    renderHook(() => useHeists("expired"));
    expect(mockWhere).toHaveBeenCalledWith("deadline", "<", "ts-now");
  });

  it("starts with loading: true before snapshot fires", () => {
    mockOnSnapshot.mockImplementation(() => mockUnsubscribe);
    const { result } = renderHook(() => useHeists("active"));
    expect(result.current.loading).toBe(true);
    expect(result.current.heists).toEqual([]);
  });

  it("sets loading: false after the first snapshot arrives", () => {
    const { result } = renderHook(() => useHeists("active"));
    expect(result.current.loading).toBe(false);
  });

  it("returns heists mapped from snapshot docs", () => {
    const { result } = renderHook(() => useHeists("active"));
    expect(result.current.heists).toEqual([fakeHeist]);
  });

  it("filters out heists with null finalStatus in 'expired' mode", () => {
    const completedHeist = {
      ...fakeHeist,
      id: "h2",
      finalStatus: "failure" as const,
    };
    const pendingHeist = { ...fakeHeist, id: "h3", finalStatus: null };
    mockOnSnapshot.mockImplementation((_q, callback: any) => {
      callback({
        docs: [{ data: () => completedHeist }, { data: () => pendingHeist }],
      });
      return mockUnsubscribe;
    });

    const { result } = renderHook(() => useHeists("expired"));
    expect(result.current.heists).toHaveLength(1);
    expect(result.current.heists[0].id).toBe("h2");
  });

  it("calls the unsubscribe function on unmount", () => {
    const { unmount } = renderHook(() => useHeists("active"));
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("does not subscribe when uid is null for 'active' mode", () => {
    mockUseUser.mockReturnValue({
      user: null,
      uid: null,
      displayName: null,
      email: null,
      loading: true,
    });
    renderHook(() => useHeists("active"));
    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });
});
