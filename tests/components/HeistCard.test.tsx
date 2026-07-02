import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HeistCard, { HeistCardSkeleton } from "@/components/HeistCard";
import { Heist } from "@/types/firestore";

const fakeHeist: Heist = {
  id: "h1",
  title: "Steal the Stapler",
  description: "Take it from desk 4B",
  createdBy: "user-1",
  createdByCodename: "IronFoxVault",
  assignedTo: "user-2",
  assignedToCodename: "SilentRavenCache",
  createdAt: new Date(2024, 0, 1),
  deadline: new Date(2024, 6, 3),
  finalStatus: null,
};

describe("HeistCard", () => {
  it("renders the heist title as a link to /heists/h1", () => {
    render(<HeistCard heist={fakeHeist} />);

    const link = screen.getByRole("link", { name: /steal the stapler/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/heists/h1");
  });

  it("renders assignedToCodename and createdByCodename", () => {
    render(<HeistCard heist={fakeHeist} />);

    expect(screen.getByText("SilentRavenCache")).toBeInTheDocument();
    expect(screen.getByText("IronFoxVault")).toBeInTheDocument();
  });

  it("renders the formatted deadline date", () => {
    render(<HeistCard heist={fakeHeist} />);

    expect(screen.getByText("3 Jul")).toBeInTheDocument();
  });

  it("does not render a status badge when finalStatus is null", () => {
    render(<HeistCard heist={fakeHeist} />);

    expect(screen.queryByText("Success")).not.toBeInTheDocument();
    expect(screen.queryByText("Failure")).not.toBeInTheDocument();
  });

  it("renders a Success badge when finalStatus is 'success'", () => {
    render(<HeistCard heist={{ ...fakeHeist, finalStatus: "success" }} />);

    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("renders a Failure badge when finalStatus is 'failure'", () => {
    render(<HeistCard heist={{ ...fakeHeist, finalStatus: "failure" }} />);

    expect(screen.getByText("Failure")).toBeInTheDocument();
  });
});

describe("HeistCardSkeleton", () => {
  it("renders without errors", () => {
    const { container } = render(<HeistCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
