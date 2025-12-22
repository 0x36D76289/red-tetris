import { describe, it, expect, beforeEach } from "vitest";
import { Game, GameError } from "../../server/models/Game.js";
import { Player } from "../../server/models/Player.js";

describe("Game Model", () => {
  let game;

  beforeEach(() => {
    game = new Game("testRoom");
  });

  describe("constructor", () => {
    it("should create game with correct properties", () => {
      expect(game.roomName).toBe("testRoom");
      expect(game.id).toBeDefined();
      expect(game.isStarted).toBe(false);
      expect(game.isFinished).toBe(false);
      expect(game.players.size).toBe(0);
      expect(game.pieces).toHaveLength(0);
    });
  });

  describe("addPlayer", () => {
    it("should add player to game", () => {
      const player = new Player("Player1", "socket1");
      game.addPlayer(player);

      expect(game.players.size).toBe(1);
      expect(game.players.get(player.id)).toBe(player);
    });

    it("should make first player host", () => {
      const player1 = new Player("Player1", "socket1");
      const player2 = new Player("Player2", "socket2");

      game.addPlayer(player1);
      game.addPlayer(player2);

      expect(player1.isHost).toBe(true);
      expect(player2.isHost).toBe(false);
    });

    it("should throw error if game started", () => {
      const player1 = new Player("Player1", "socket1");
      game.addPlayer(player1);
      game.start();

      const player2 = new Player("Player2", "socket2");
      expect(() => game.addPlayer(player2)).toThrow(GameError);
    });

    it("should throw error if player already in game", () => {
      const player = new Player("Player1", "socket1");
      game.addPlayer(player);

      expect(() => game.addPlayer(player)).toThrow(GameError);
    });
  });

  describe("removePlayer", () => {
    it("should remove player from game", () => {
      const player = new Player("Player1", "socket1");
      game.addPlayer(player);
      game.removePlayer(player.id);

      expect(game.players.size).toBe(0);
    });

    it("should reassign host when host leaves", () => {
      const player1 = new Player("Player1", "socket1");
      const player2 = new Player("Player2", "socket2");

      game.addPlayer(player1);
      game.addPlayer(player2);
      game.removePlayer(player1.id);

      expect(player2.isHost).toBe(true);
    });

    it("should handle removing non-existent player", () => {
      expect(() => game.removePlayer("invalid")).not.toThrow();
    });
  });

  describe("getPlayer", () => {
    it("should return player by id", () => {
      const player = new Player("Player1", "socket1");
      game.addPlayer(player);

      expect(game.getPlayer(player.id)).toBe(player);
    });

    it("should return undefined for invalid id", () => {
      expect(game.getPlayer("invalid")).toBeUndefined();
    });
  });

  describe("getPlayerBySocketId", () => {
    it("should return player by socket id", () => {
      const player = new Player("Player1", "socket1");
      game.addPlayer(player);

      expect(game.getPlayerBySocketId("socket1")).toBe(player);
    });

    it("should return null for invalid socket id", () => {
      expect(game.getPlayerBySocketId("invalid")).toBeNull();
    });
  });

  describe("getHost", () => {
    it("should return host player", () => {
      const player1 = new Player("Player1", "socket1");
      const player2 = new Player("Player2", "socket2");

      game.addPlayer(player1);
      game.addPlayer(player2);

      expect(game.getHost()).toBe(player1);
    });

    it("should return null if no players", () => {
      expect(game.getHost()).toBeNull();
    });
  });

  describe("generatePieces", () => {
    it("should generate specified number of pieces", () => {
      game.generatePieces(50);
      expect(game.pieces).toHaveLength(50);
    });

    it("should default to 100 pieces", () => {
      game.generatePieces();
      expect(game.pieces).toHaveLength(100);
    });
  });

  describe("getPiece", () => {
    it("should return piece at index", () => {
      game.generatePieces(10);
      const piece = game.getPiece(5);

      expect(piece).toBeDefined();
      expect(piece.type).toBeDefined();
    });

    it("should generate more pieces if needed", () => {
      game.generatePieces(5);
      const piece = game.getPiece(10);

      expect(piece).toBeDefined();
      expect(game.pieces.length).toBeGreaterThan(10);
    });

    it("should return cloned pieces", () => {
      game.generatePieces(5);
      const piece1 = game.getPiece(0);
      const piece2 = game.getPiece(0);

      piece1.x = 100;
      expect(piece2.x).not.toBe(100);
    });
  });

  describe("start", () => {
    it("should start game", () => {
      const player = new Player("Player1", "socket1");
      game.addPlayer(player);
      game.start();

      expect(game.isStarted).toBe(true);
      expect(game.isFinished).toBe(false);
      expect(game.pieces.length).toBeGreaterThan(0);
    });

    it("should reset all players", () => {
      const player = new Player("Player1", "socket1");
      player.score = 1000;
      game.addPlayer(player);
      game.start();

      expect(player.score).toBe(0);
      expect(player.isPlaying).toBe(true);
    });

    it("should throw error with no players", () => {
      expect(() => game.start()).toThrow(GameError);
    });
  });

  describe("restart", () => {
    it("should reset game state", () => {
      const player = new Player("Player1", "socket1");
      game.addPlayer(player);
      game.start();
      game.restart();

      expect(game.isStarted).toBe(false);
      expect(game.isFinished).toBe(false);
      expect(game.pieces).toHaveLength(0);
    });
  });

  describe("eliminatePlayer", () => {
    it("should eliminate player", () => {
      const player = new Player("Player1", "socket1");
      game.addPlayer(player);
      game.start();
      game.eliminatePlayer(player.id);

      expect(player.isEliminated).toBe(true);
    });
  });

  describe("checkGameOver", () => {
    it("should finish game when all eliminated", () => {
      const player = new Player("Player1", "socket1");
      game.addPlayer(player);
      game.start();
      player.eliminate();

      const result = game.checkGameOver();

      expect(result).toBe(true);
      expect(game.isFinished).toBe(true);
    });

    it("should finish game with winner in multiplayer", () => {
      const player1 = new Player("Player1", "socket1");
      const player2 = new Player("Player2", "socket2");

      game.addPlayer(player1);
      game.addPlayer(player2);
      game.start();
      player1.eliminate();

      game.checkGameOver();

      expect(game.isFinished).toBe(true);
      expect(game.winner).toBe(player2);
    });

    it("should not finish with multiple active players", () => {
      const player1 = new Player("Player1", "socket1");
      const player2 = new Player("Player2", "socket2");

      game.addPlayer(player1);
      game.addPlayer(player2);
      game.start();

      const result = game.checkGameOver();

      expect(result).toBe(false);
    });
  });

  describe("distributePenaltyLines", () => {
    it("should add penalty lines to other players", () => {
      const player1 = new Player("Player1", "socket1");
      const player2 = new Player("Player2", "socket2");

      game.addPlayer(player1);
      game.addPlayer(player2);
      game.start();

      game.distributePenaltyLines(player1.id, 3);

      expect(player2.board[18].every((cell) => cell === -1)).toBe(true);
      expect(player2.board[19].every((cell) => cell === -1)).toBe(true);
    });

    it("should not add penalty for single line clear", () => {
      const player1 = new Player("Player1", "socket1");
      const player2 = new Player("Player2", "socket2");

      game.addPlayer(player1);
      game.addPlayer(player2);
      game.start();

      game.distributePenaltyLines(player1.id, 1);

      expect(player2.board[19].every((cell) => cell === 0)).toBe(true);
    });

    it("should not affect eliminated players", () => {
      const player1 = new Player("Player1", "socket1");
      const player2 = new Player("Player2", "socket2");

      game.addPlayer(player1);
      game.addPlayer(player2);
      game.start();
      player2.eliminate();

      game.distributePenaltyLines(player1.id, 4);

      expect(player2.board[19].every((cell) => cell === 0)).toBe(true);
    });
  });

  describe("toJSON", () => {
    it("should serialize to JSON", () => {
      const player = new Player("Player1", "socket1");
      game.addPlayer(player);
      game.generatePieces(10);

      const json = game.toJSON();

      expect(json.id).toBe(game.id);
      expect(json.roomName).toBe("testRoom");
      expect(json.players).toHaveLength(1);
      expect(json.isStarted).toBe(false);
      expect(json.pieceCount).toBe(10);
    });
  });
});

describe("GameError", () => {
  it("should create error with message", () => {
    const error = new GameError("Test error");
    expect(error.message).toBe("Test error");
    expect(error.name).toBe("GameError");
  });
});
