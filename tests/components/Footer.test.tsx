import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders the current year", () => {
    render(<Footer />);
    expect(
      screen.getByText(new RegExp(String(new Date().getFullYear()))),
    ).toBeInTheDocument();
  });

  it("renders the Pocket Heist copyright phrase", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Pocket Heist\. All rights given/),
    ).toBeInTheDocument();
  });
});
