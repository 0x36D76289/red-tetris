let mockSocketInstance;

jest.mock("socket.io-client", () => {
  return {
    io: jest.fn(() => mockSocketInstance),
  };
});

import {
  initializeSocket,
  joinGame,
  startGame,
  leaveGame,
  lineCleared,
  gameOver,
  requestNextPiece,
  usePiece,
  playerMove,
  playerRotate,
  playerDrop,
} from "../client/redux/actions/socketActions";

describe("Socket Actions", () => {
  let mockSocket;
  let dispatch;

  beforeEach(() => {
    mockSocketInstance = {
      on: jest.fn(),
      emit: jest.fn(),
      connected: false,
    };
    dispatch = jest.fn();
    const {
      __setSocketForTests,
      getSocket,
    } = require("../client/redux/actions/socketActions");
    __setSocketForTests(mockSocketInstance);
    mockSocket = getSocket();
  });

  describe("initializeSocket", () => {
    it("should initialize socket and set up listeners", () => {
      initializeSocket()(dispatch);
      const { getSocket } = require("../client/redux/actions/socketActions");
      expect(getSocket()).toBeTruthy();
    });
  });

  describe("joinGame", () => {
    it("should emit join_game event", () => {
      joinGame("room1", "Player1")(dispatch);

      expect(mockSocket.emit).toHaveBeenCalledWith("join_game", {
        roomName: "room1",
        playerName: "Player1",
      });
    });
  });

  describe("startGame", () => {
    it("should emit start_game event", () => {
      startGame()(dispatch);

      expect(mockSocket.emit).toHaveBeenCalledWith("start_game");
    });
  });

  describe("leaveGame", () => {
    it("should emit leave_game event", () => {
      leaveGame()(dispatch);

      expect(mockSocket.emit).toHaveBeenCalledWith("leave_game");
    });
  });

  describe("lineCleared", () => {
    it("should emit line_cleared event", () => {
      const piece = { type: "I", x: 3, y: 0, rotation: 0 };

      lineCleared(piece)(dispatch);

      expect(mockSocket.emit).toHaveBeenCalledWith("line_cleared", {
        piece,
      });
    });
  });

  describe("gameOver", () => {
    it("should dispatch GAME_OVER and emit game_over", () => {
      gameOver()(dispatch);

      expect(dispatch).toHaveBeenCalledWith({ type: "GAME_OVER" });
      expect(mockSocket.emit).toHaveBeenCalledWith("game_over");
    });
  });

  describe("requestNextPiece", () => {
    it("should emit request_next_piece event", () => {
      requestNextPiece()(dispatch);

      expect(mockSocket.emit).toHaveBeenCalledWith("request_next_piece");
    });
  });

  describe("usePiece", () => {
    it("should dispatch USE_PIECE action", () => {
      usePiece()(dispatch);

      expect(dispatch).toHaveBeenCalledWith({ type: "USE_PIECE" });
    });
  });

  describe("playerMove", () => {
    it("should emit player_move event", () => {
      playerMove("left")(dispatch);

      expect(mockSocket.emit).toHaveBeenCalledWith("player_move", {
        direction: "left",
      });
    });
  });

  describe("playerRotate", () => {
    it("should emit player_rotate event", () => {
      playerRotate()(dispatch);

      expect(mockSocket.emit).toHaveBeenCalledWith("player_rotate");
    });
  });

  describe("playerDrop", () => {
    it("should emit player_drop event", () => {
      playerDrop("hard")(dispatch);

      expect(mockSocket.emit).toHaveBeenCalledWith("player_drop", {
        type: "hard",
      });
    });
  });
});
