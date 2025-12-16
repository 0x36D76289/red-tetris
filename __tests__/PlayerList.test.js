import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PlayerList from "../client/components/PlayerList";

describe("PlayerList Component", () => {
  const mockPlayers = [
    { socketId: "socket1", name: "Player1", isHost: true, isAlive: true },
    { socketId: "socket2", name: "Player2", isHost: false, isAlive: true },
    { socketId: "socket3", name: "Player3", isHost: false, isAlive: false },
  ];

  it("should render player list", () => {
    render(<PlayerList players={mockPlayers} currentPlayer="Player1" />);

    expect(screen.getByText(/Players \(3\)/)).toBeInTheDocument();
  });

  it("should render all players", () => {
    render(<PlayerList players={mockPlayers} currentPlayer="Player1" />);

    expect(screen.getByText(/Player1/)).toBeInTheDocument();
    expect(screen.getByText(/Player2/)).toBeInTheDocument();
    expect(screen.getByText(/Player3/)).toBeInTheDocument();
  });

  it("should handle empty player list", () => {
    render(<PlayerList players={[]} currentPlayer="Player1" />);

    expect(screen.getByText(/Players \(0\)/)).toBeInTheDocument();
  });

  it("should highlight current player", () => {
    const { container } = render(
      <PlayerList players={mockPlayers} currentPlayer="Player1" />
    );

    const playerElements = container.querySelectorAll(".player-item");
    expect(playerElements.length).toBe(3);
  });
});
