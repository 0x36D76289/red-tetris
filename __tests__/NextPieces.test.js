import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NextPieces from "../client/components/NextPieces";

describe("NextPieces Component", () => {
  it("should render next pieces label", () => {
    render(<NextPieces pieces={[]} />);

    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("should render list of next pieces", () => {
    const pieces = ["I", "O", "T"];

    const { container } = render(<NextPieces pieces={pieces} />);

    const pieceElements = container.querySelectorAll(".next-piece");
    expect(pieceElements.length).toBe(3);
  });

  it("should handle empty pieces array", () => {
    render(<NextPieces pieces={[]} />);

    expect(screen.getByText("Next")).toBeInTheDocument();
  });
});
