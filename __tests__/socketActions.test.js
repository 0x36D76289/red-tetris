import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  initializeSocket,
  joinGame,
  startGame,
  leaveGame,
  lineCleared,
  gameOver,
  requestNextPiece,
  usePiece,
} from "../client/redux/actions/socketActions";

// Mock socket.io-client
jest.mock("socket.io-client", () => {
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn(),
    connected: false,
  };
  return {
    io: jest.fn(() => mockSocket),
  };
});

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Socket Actions", () => {
  let store;
  let mockSocket;

  beforeEach(() => {
    const io = require("socket.io-client").io;
    mockSocket = io();
    store = mockStore({});
    jest.clearAllMocks();
  });

  describe("initializeSocket", () => {
    it("should initialize socket and set up listeners", () => {
      store.dispatch(initializeSocket());

      expect(mockSocket.on).toHaveBeenCalledWith(
        "connect",
        expect.any(Function)
      );
      expect(mockSocket.on).toHaveBeenCalledWith(
        "disconnect",
        expect.any(Function)
      );
      expect(mockSocket.on).toHaveBeenCalledWith(
        "join_success",
        expect.any(Function)
      );
      expect(mockSocket.on).toHaveBeenCalledWith(
        "join_error",
        expect.any(Function)
      );
    });
  });

  describe("joinGame", () => {
    it("should emit join_game event", () => {
      store.dispatch(joinGame("room1", "Player1"));

      expect(mockSocket.emit).toHaveBeenCalledWith("join_game", {
        roomName: "room1",
        playerName: "Player1",
      });
    });
  });

  describe("startGame", () => {
    it("should emit start_game event", () => {
      store.dispatch(startGame());

      expect(mockSocket.emit).toHaveBeenCalledWith("start_game");
    });
  });

  describe("leaveGame", () => {
    it("should emit leave_game event", () => {
      store.dispatch(leaveGame());

      expect(mockSocket.emit).toHaveBeenCalledWith("leave_game");
    });
  });

  describe("lineCleared", () => {
    it("should emit line_cleared event", () => {
      const testField = Array(20)
        .fill(null)
        .map(() => Array(10).fill(0));

      store.dispatch(lineCleared(2, testField));

      expect(mockSocket.emit).toHaveBeenCalledWith("line_cleared", {
        linesCleared: 2,
        field: testField,
      });
    });
  });

  describe("gameOver", () => {
    it("should dispatch GAME_OVER and emit game_over", () => {
      store.dispatch(gameOver());

      const actions = store.getActions();
      expect(actions).toContainEqual({ type: "GAME_OVER" });
      expect(mockSocket.emit).toHaveBeenCalledWith("game_over");
    });
  });

  describe("requestNextPiece", () => {
    it("should emit request_next_piece event", () => {
      store.dispatch(requestNextPiece());

      expect(mockSocket.emit).toHaveBeenCalledWith("request_next_piece");
    });
  });

  describe("usePiece", () => {
    it("should dispatch USE_PIECE action", () => {
      store.dispatch(usePiece());

      const actions = store.getActions();
      expect(actions).toContainEqual({ type: "USE_PIECE" });
    });
  });

  describe("playerMove", () => {
    it("should emit player_move event", () => {
      const { playerMove } = require("../client/redux/actions/socketActions");
      store.dispatch(playerMove("left"));

      expect(mockSocket.emit).toHaveBeenCalledWith("player_move", {
        direction: "left",
      });
    });
  });

  describe("playerRotate", () => {
    it("should emit player_rotate event", () => {
      const { playerRotate } = require("../client/redux/actions/socketActions");
      store.dispatch(playerRotate());

      expect(mockSocket.emit).toHaveBeenCalledWith("player_rotate");
    });
  });

  describe("playerDrop", () => {
    it("should emit player_drop event", () => {
      const { playerDrop } = require("../client/redux/actions/socketActions");
      store.dispatch(playerDrop("hard"));

      expect(mockSocket.emit).toHaveBeenCalledWith("player_drop", {
        type: "hard",
      });
    });
  });
});
