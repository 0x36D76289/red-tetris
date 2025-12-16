import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SpectrumView from "../client/components/SpectrumView";

describe("SpectrumView Component", () => {
  const mockSpectrums = {
    Player1: [5, 3, 7, 2, 8, 4, 6, 1, 9, 0],
    Player2: [2, 4, 3, 5, 1, 6, 0, 7, 2, 3],
  };

  it("should render spectrum view label", () => {
    render(<SpectrumView spectrums={mockSpectrums} currentPlayer="Player1" />);

    expect(screen.getByText("Opponent Fields")).toBeInTheDocument();
  });

  it("should render all opponent spectrums", () => {
    render(<SpectrumView spectrums={mockSpectrums} currentPlayer="Player1" />);

    // Should show Player2 but not Player1 (current player)
    expect(screen.getByText("Player2")).toBeInTheDocument();
    expect(screen.queryByText("Player1")).not.toBeInTheDocument();
  });

  it("should handle empty spectrums", () => {
    render(<SpectrumView spectrums={{}} currentPlayer="Player1" />);

    expect(screen.getByText("Opponent Fields")).toBeInTheDocument();
  });

  it("should filter out current player", () => {
    const { container } = render(
      <SpectrumView spectrums={mockSpectrums} currentPlayer="Player1" />
    );

    const spectrumElements = container.querySelectorAll(".spectrum-item");
    expect(spectrumElements.length).toBe(1); // Only Player2
  });
});
