import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Board } from "../../client/components/Board.jsx";
import { NextPiece } from "../../client/components/NextPiece.jsx";
import { Spectrum } from "../../client/components/Spectrum.jsx";
import { ScorePanel } from "../../client/components/ScorePanel.jsx";
import { PlayerList } from "../../client/components/PlayerList.jsx";
import { Controls } from "../../client/components/Controls.jsx";
import { createEmptyBoard } from "../../client/game/tetris.js";

describe("Board Component", () => {
  it("should render empty board", () => {
    const board = createEmptyBoard();
    const { container } = render(<Board board={board} currentPiece={null} />);

    expect(container.querySelector(".board")).toBeDefined();
    expect(container.querySelectorAll(".board-row")).toHaveLength(20);
  });

  it("should render board with current piece", () => {
    const board = createEmptyBoard();
    const piece = { type: "I", x: 3, y: 0, rotation: 0 };

    const { container } = render(
      <Board board={board} currentPiece={piece} showGhost={true} />
    );

    expect(container.querySelector(".board")).toBeDefined();
  });

  it("should render without ghost when disabled", () => {
    const board = createEmptyBoard();
    const piece = { type: "T", x: 5, y: 5, rotation: 0 };

    const { container } = render(
      <Board board={board} currentPiece={piece} showGhost={false} />
    );

    expect(container.querySelector(".board")).toBeDefined();
  });
});

describe("NextPiece Component", () => {
  it("should render empty state when no piece", () => {
    render(<NextPiece piece={null} />);
    expect(screen.getByText("Next")).toBeDefined();
  });

  it("should render piece preview", () => {
    const piece = { type: "T", rotation: 0 };
    render(<NextPiece piece={piece} />);

    expect(screen.getByText("Next")).toBeDefined();
  });
});

describe("Spectrum Component", () => {
  it("should render player spectrum", () => {
    const player = { id: "1", name: "TestPlayer" };
    const spectrum = Array(10).fill(20);

    render(<Spectrum player={player} spectrum={spectrum} />);

    expect(screen.getByText("TestPlayer")).toBeDefined();
  });

  it("should show eliminated state", () => {
    const player = { id: "1", name: "TestPlayer", isEliminated: true };

    render(<Spectrum player={player} spectrum={null} />);

    expect(screen.getByText("ELIMINATED")).toBeDefined();
  });

  it("should handle missing player", () => {
    render(<Spectrum player={null} spectrum={null} />);
    expect(screen.getByText("Unknown")).toBeDefined();
  });
});

describe("ScorePanel Component", () => {
  it("should render score and lines", () => {
    render(<ScorePanel score={1500} linesCleared={10} />);

    expect(screen.getByText("1500")).toBeDefined();
    expect(screen.getByText("10")).toBeDefined();
  });

  it("should handle zero values", () => {
    render(<ScorePanel score={0} linesCleared={0} />);

    expect(screen.getAllByText("0")).toHaveLength(2);
  });

  it("should handle undefined values", () => {
    render(<ScorePanel />);

    expect(screen.getAllByText("0")).toHaveLength(2);
  });
});

describe("PlayerList Component", () => {
  it("should render player list", () => {
    const players = [
      { id: "1", name: "Player1", isHost: true },
      { id: "2", name: "Player2", isHost: false },
    ];

    render(<PlayerList players={players} currentPlayerId="1" />);

    expect(screen.getByText("Player1")).toBeDefined();
    expect(screen.getByText("Player2")).toBeDefined();
    expect(screen.getByText("HOST")).toBeDefined();
  });

  it("should show eliminated badge", () => {
    const players = [{ id: "1", name: "Player1", isEliminated: true }];

    render(<PlayerList players={players} currentPlayerId="2" />);

    expect(screen.getByText("OUT")).toBeDefined();
  });
});

describe("Controls Component", () => {
  it("should render control instructions", () => {
    render(<Controls />);

    expect(screen.getByText("Controls")).toBeDefined();
    expect(screen.getByText("Move")).toBeDefined();
    expect(screen.getByText("Rotate")).toBeDefined();
    expect(screen.getByText("Soft Drop")).toBeDefined();
    expect(screen.getByText("Hard Drop")).toBeDefined();
  });
});
