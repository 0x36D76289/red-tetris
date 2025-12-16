const Game = require("../server/game/Game");
const Player = require("../server/game/Player");
const Piece = require("../server/game/Piece");

describe("Game", () => {
  let mockIo;
  let game;

  beforeEach(() => {
    mockIo = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      in: jest.fn().mockReturnThis(),
      socketsJoin: jest.fn(),
    };
    game = new Game("testRoom", mockIo);
  });

  describe("constructor", () => {
    it("should initialize with correct properties", () => {
      expect(game.roomName).toBe("testRoom");
      expect(game.io).toBe(mockIo);
      expect(game.players.size).toBe(0);
      expect(game.isStarted).toBe(false);
      expect(game.isFinished).toBe(false);
      expect(game.pieceSequence).toEqual([]);
      expect(game.currentPieceIndex).toBe(0);
    });
  });

  describe("addPlayer", () => {
    it("should add first player as host", () => {
      const result = game.addPlayer("socket1", "Player1");

      expect(result.success).toBe(true);
      expect(result.isHost).toBe(true);
      expect(game.players.size).toBe(1);
    });

    it("should add second player as non-host", () => {
      game.addPlayer("socket1", "Player1");
      const result = game.addPlayer("socket2", "Player2");

      expect(result.success).toBe(true);
      expect(result.isHost).toBe(false);
      expect(game.players.size).toBe(2);
    });

    it("should reject duplicate names", () => {
      game.addPlayer("socket1", "Player1");
      const result = game.addPlayer("socket2", "Player1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Name already taken");
    });

    it("should reject adding player when game started", () => {
      game.addPlayer("socket1", "Player1");
      game.start();
      const result = game.addPlayer("socket2", "Player2");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Game already started");
    });
  });

  describe("removePlayer", () => {
    it("should remove player correctly", () => {
      game.addPlayer("socket1", "Player1");
      game.removePlayer("socket1");

      expect(game.players.size).toBe(0);
    });

    it("should assign new host when host leaves", () => {
      game.addPlayer("socket1", "Player1");
      game.addPlayer("socket2", "Player2");

      game.removePlayer("socket1");

      const newHost = game.players.get("socket2");
      expect(newHost.isHost).toBe(true);
      expect(mockIo.to).toHaveBeenCalledWith("socket2");
      expect(mockIo.emit).toHaveBeenCalledWith("host_assigned");
    });

    it("should end game if only one player remains after removal during game", () => {
      game.addPlayer("socket1", "Player1");
      game.addPlayer("socket2", "Player2");
      game.start();

      game.removePlayer("socket1");

      expect(game.isFinished).toBe(true);
    });
  });

  describe("start", () => {
    it("should start game successfully", () => {
      game.addPlayer("socket1", "Player1");
      const result = game.start();

      expect(result.success).toBe(true);
      expect(game.isStarted).toBe(true);
      expect(game.pieceSequence.length).toBeGreaterThan(0);
    });

    it("should reject starting already started game", () => {
      game.addPlayer("socket1", "Player1");
      game.start();
      const result = game.start();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Game already started");
    });

    it("should reject starting game with no players", () => {
      const result = game.start();

      expect(result.success).toBe(false);
      expect(result.error).toBe("No players in game");
    });
  });

  describe("generatePieceSequence", () => {
    it("should generate correct number of pieces", () => {
      game.generatePieceSequence(50);

      expect(game.pieceSequence.length).toBe(50);
    });

    it("should generate valid piece types", () => {
      game.generatePieceSequence(10);

      game.pieceSequence.forEach((type) => {
        expect(Piece.PIECE_TYPES).toContain(type);
      });
    });
  });

  describe("getNextPieces", () => {
    beforeEach(() => {
      game.generatePieceSequence(10);
    });

    it("should return correct pieces", () => {
      const pieces = game.getNextPieces(0, 5);

      expect(pieces.length).toBe(5);
      expect(pieces).toEqual(game.pieceSequence.slice(0, 5));
    });

    it("should generate more pieces if needed", () => {
      const pieces = game.getNextPieces(8, 5);

      expect(pieces.length).toBe(5);
      expect(game.pieceSequence.length).toBeGreaterThan(10);
    });
  });

  describe("playerCompletedLines", () => {
    beforeEach(() => {
      game.addPlayer("socket1", "Player1");
      game.addPlayer("socket2", "Player2");
      game.start();
    });

    it("should send penalty to other players when clearing multiple lines", () => {
      game.playerCompletedLines("socket1", 2);

      expect(mockIo.to).toHaveBeenCalledWith("socket2");
      expect(mockIo.emit).toHaveBeenCalledWith(
        "penalty_received",
        expect.objectContaining({
          count: 1,
        })
      );
    });

    it("should not send penalty when clearing single line", () => {
      mockIo.emit.mockClear();
      game.playerCompletedLines("socket1", 1);

      const penaltyCalls = mockIo.emit.mock.calls.filter(
        (call) => call[0] === "penalty_received"
      );
      expect(penaltyCalls.length).toBe(0);
    });

    it("should broadcast spectrum update", () => {
      game.playerCompletedLines("socket1", 2);

      expect(mockIo.to).toHaveBeenCalledWith("testRoom");
      expect(mockIo.emit).toHaveBeenCalledWith(
        "spectrums_update",
        expect.any(Object)
      );
    });
  });

  describe("playerDied", () => {
    beforeEach(() => {
      game.addPlayer("socket1", "Player1");
      game.addPlayer("socket2", "Player2");
      game.start();
    });

    it("should mark player as dead", () => {
      game.playerDied("socket1");

      const player = game.players.get("socket1");
      expect(player.isAlive).toBe(false);
    });

    it("should end game when only one player remains", () => {
      game.playerDied("socket1");

      expect(game.isFinished).toBe(true);
      expect(mockIo.to).toHaveBeenCalledWith("testRoom");
      expect(mockIo.emit).toHaveBeenCalledWith(
        "game_ended",
        expect.objectContaining({
          winner: "Player2",
        })
      );
    });
  });

  describe("getAlivePlayers", () => {
    it("should return only alive players", () => {
      game.addPlayer("socket1", "Player1");
      game.addPlayer("socket2", "Player2");
      game.start();

      game.playerDied("socket1");

      const alivePlayers = game.getAlivePlayers();
      expect(alivePlayers.length).toBe(1);
      expect(alivePlayers[0].name).toBe("Player2");
    });
  });

  describe("endGame", () => {
    it("should broadcast game ended with winner", () => {
      game.addPlayer("socket1", "Player1");
      game.addPlayer("socket2", "Player2");
      game.start();
      game.playerDied("socket1");

      expect(game.isFinished).toBe(true);
      expect(mockIo.emit).toHaveBeenCalledWith(
        "game_ended",
        expect.objectContaining({
          winner: "Player2",
        })
      );
    });
  });

  describe("isEmpty", () => {
    it("should return true when no players", () => {
      expect(game.isEmpty()).toBe(true);
    });

    it("should return false when players exist", () => {
      game.addPlayer("socket1", "Player1");
      expect(game.isEmpty()).toBe(false);
    });
  });
});
