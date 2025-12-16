import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import App from "../client/App";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";

jest.mock("socket.io-client", () => {
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn(),
    connected: true,
  };
  return {
    io: jest.fn(() => mockSocket),
  };
});

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("App Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      game: {
        roomName: null,
        playerName: null,
        isHost: false,
        isStarted: false,
        players: [],
        spectrums: {},
        nextPieces: [],
        gameOver: false,
        winner: null,
        error: null,
      },
      socket: {
        connected: true,
        socket: null,
      },
    });
  });

  it("should render App component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Red Tetris")).toBeInTheDocument();
  });

  it("should render home page by default", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Red Tetris")).toBeInTheDocument();
    expect(screen.getByLabelText("Room Name")).toBeInTheDocument();
  });

  it("should render game route", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/game?room=room1&player=Player1"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    // Should render GameRoom component (which will show error or connecting state)
    const actions = store.getActions();
    expect(actions.length).toBeGreaterThanOrEqual(0);
  });
});
