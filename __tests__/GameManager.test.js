const GameManager = require("../server/game/GameManager");

describe("GameManager", () => {
  let mockIo;
  let gameManager;
  let mockSocket;

  beforeEach(() => {
    mockIo = {
      to: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      socketsJoin: jest.fn(),
      socketsLeave: jest.fn(),
    };

    mockSocket = {
      id: "socket123",
      emit: jest.fn(),
    };

    gameManager = new GameManager(mockIo);
  });

  describe("handleJoinGame", () => {
    it("should create new game and add player", () => {
      gameManager.handleJoinGame(mockSocket, {
        roomName: "room1",
        playerName: "Player1",
      });

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "join_success",
        expect.objectContaining({
          roomName: "room1",
          playerName: "Player1",
          isHost: true,
        })
      );
      expect(gameManager.games.size).toBe(1);
      expect(gameManager.playerToGame.get("socket123")).toBe("room1");
    });

    it("should add player to existing game", () => {
      const mockSocket2 = { id: "socket456", emit: jest.fn() };

      gameManager.handleJoinGame(mockSocket, {
        roomName: "room1",
        playerName: "Player1",
      });

      gameManager.handleJoinGame(mockSocket2, {
        roomName: "room1",
        playerName: "Player2",
      });

      expect(mockSocket2.emit).toHaveBeenCalledWith(
        "join_success",
        expect.objectContaining({
          roomName: "room1",
          playerName: "Player2",
          isHost: false,
        })
      );
      expect(gameManager.games.size).toBe(1);
    });

    it("should reject join without room name", () => {
      gameManager.handleJoinGame(mockSocket, {
        playerName: "Player1",
      });

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "join_error",
        expect.objectContaining({
          error: "Room name and player name required",
        })
      );
    });

    it("should reject duplicate name in same room", () => {
      const mockSocket2 = { id: "socket456", emit: jest.fn() };

      gameManager.handleJoinGame(mockSocket, {
        roomName: "room1",
        playerName: "Player1",
      });

      gameManager.handleJoinGame(mockSocket2, {
        roomName: "room1",
        playerName: "Player1",
      });

      expect(mockSocket2.emit).toHaveBeenCalledWith(
        "join_error",
        expect.objectContaining({
          error: "Name already taken",
        })
      );
    });

    it("should handle player already in room", () => {
      gameManager.handleJoinGame(mockSocket, {
        roomName: "room1",
        playerName: "Player1",
      });

      mockSocket.emit.mockClear();

      gameManager.handleJoinGame(mockSocket, {
        roomName: "room1",
        playerName: "Player1",
      });

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "join_error",
        expect.objectContaining({
          error: "Already in this room",
        })
      );
    });
  });

  describe("handleStartGame", () => {
    beforeEach(() => {
      gameManager.handleJoinGame(mockSocket, {
        roomName: "room1",
        playerName: "Player1",
      });
    });

    it("should start game when host requests", () => {
      gameManager.handleStartGame(mockSocket);

      expect(mockIo.to).toHaveBeenCalledWith("socket123");
      expect(mockIo.emit).toHaveBeenCalledWith(
        "game_started",
        expect.objectContaining({
          pieces: expect.any(Array),
        })
      );
    });

    it("should reject start from non-host", () => {
      const mockSocket2 = { id: "socket456", emit: jest.fn() };

      gameManager.handleJoinGame(mockSocket2, {
        roomName: "room1",
        playerName: "Player2",
      });

      gameManager.handleStartGame(mockSocket2);

      expect(mockSocket2.emit).toHaveBeenCalledWith(
        "game_error",
        expect.objectContaining({
          error: "Only host can start game",
        })
      );
    });

    it("should reject start when not in game", () => {
      const mockSocket2 = { id: "socket456", emit: jest.fn() };

      gameManager.handleStartGame(mockSocket2);

      expect(mockSocket2.emit).toHaveBeenCalledWith(
        "game_error",
        expect.objectContaining({
          error: "Not in a game",
        })
      );
    });
  });

  describe("handleLineCleared", () => {
    beforeEach(() => {
      gameManager.handleJoinGame(mockSocket, {
        roomName: "room1",
        playerName: "Player1",
      });
      gameManager.handleStartGame(mockSocket);
    });

    it("should handle line cleared event", () => {
      const mockSocket2 = { id: "socket456", emit: jest.fn() };
      gameManager.handleJoinGame(mockSocket2, {
        roomName: "room1",
        playerName: "Player2",
      });

      const testField = Array(20)
        .fill(null)
        .map(() => Array(10).fill(0));

      gameManager.handleLineCleared(mockSocket, {
        linesCleared: 2,
        field: testField,
      });

      // Should send penalty to other player
      expect(mockIo.to).toHaveBeenCalled();
    });
  });

  describe("handleGameOver", () => {
    beforeEach(() => {
      gameManager.handleJoinGame(mockSocket, {
        roomName: "room1",
        playerName: "Player1",
      });
      const mockSocket2 = { id: "socket456", emit: jest.fn() };
      gameManager.handleJoinGame(mockSocket2, {
        roomName: "room1",
        playerName: "Player2",
      });
      gameManager.handleStartGame(mockSocket);
    });

    it("should mark player as dead", () => {
      gameManager.handleGameOver(mockSocket);

      const game = gameManager.games.get("room1");
      const player = game.players.get("socket123");
      expect(player.isAlive).toBe(false);
    });
  });

  describe("handleLeaveGame", () => {
    beforeEach(() => {
      gameManager.handleJoinGame(mockSocket, {
        roomName: "room1",
        playerName: "Player1",
      });
    });

    it("should remove player from game", () => {
      gameManager.handleLeaveGame(mockSocket);

      expect(gameManager.playerToGame.has("socket123")).toBe(false);
    });

    it("should delete empty game", () => {
      gameManager.handleLeaveGame(mockSocket);

      expect(gameManager.games.has("room1")).toBe(false);
    });

    it("should not delete game with remaining players", () => {
      const mockSocket2 = { id: "socket456", emit: jest.fn() };
      gameManager.handleJoinGame(mockSocket2, {
        roomName: "room1",
        playerName: "Player2",
      });

      gameManager.handleLeaveGame(mockSocket);

      expect(gameManager.games.has("room1")).toBe(true);
    });
  });

  describe("handleDisconnect", () => {
    it("should call handleLeaveGame", () => {
      gameManager.handleJoinGame(mockSocket, {
        roomName: "room1",
        playerName: "Player1",
      });

      gameManager.handleDisconnect(mockSocket);

      expect(gameManager.playerToGame.has("socket123")).toBe(false);
    });
  });

  describe("requestNextPiece", () => {
    beforeEach(() => {
      gameManager.handleJoinGame(mockSocket, {
        roomName: "room1",
        playerName: "Player1",
      });
      gameManager.handleStartGame(mockSocket);
    });

    it("should send next piece to player", () => {
      gameManager.requestNextPiece(mockSocket);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        "next_piece",
        expect.objectContaining({
          piece: expect.any(String),
        })
      );
    });
  });
});
