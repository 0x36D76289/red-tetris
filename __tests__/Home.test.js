import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../client/components/Home";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Home Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("should render home page", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText("Red Tetris")).toBeInTheDocument();
    expect(screen.getByLabelText("Room Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Player Name")).toBeInTheDocument();
  });

  it("should update input values", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const roomInput = screen.getByLabelText("Room Name");
    const playerInput = screen.getByLabelText("Player Name");

    fireEvent.change(roomInput, { target: { value: "TestRoom" } });
    fireEvent.change(playerInput, { target: { value: "TestPlayer" } });

    expect(roomInput.value).toBe("TestRoom");
    expect(playerInput.value).toBe("TestPlayer");
  });

  it("should navigate to game on form submit", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const roomInput = screen.getByLabelText("Room Name");
    const playerInput = screen.getByLabelText("Player Name");
    const submitButton = screen.getByText("Join Game");

    fireEvent.change(roomInput, { target: { value: "TestRoom" } });
    fireEvent.change(playerInput, { target: { value: "TestPlayer" } });
    fireEvent.click(submitButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/game?room=TestRoom&player=TestPlayer"
    );
  });

  it("should show game instructions", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText("How to Play")).toBeInTheDocument();
    expect(screen.getByText(/Move piece left\/right/)).toBeInTheDocument();
  });
});
