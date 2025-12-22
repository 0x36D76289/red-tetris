import { describe, it, expect, beforeEach } from "vitest";
import { Player } from "../../server/models/Player.js";

describe("Player Model", () => {
  let player;

  beforeEach(() => {
    player = new Player("TestPlayer", "socket123");
  });

  describe("constructor", () => {
    it("should create player with correct properties", () => {
      expect(player.name).toBe("TestPlayer");
      expect(player.socketId).toBe("socket123");
      expect(player.id).toBeDefined();
      expect(player.isHost).toBe(false);
      expect(player.isPlaying).toBe(false);
      expect(player.isEliminated).toBe(false);
      expect(player.score).toBe(0);
      expect(player.linesCleared).toBe(0);
      expect(player.currentPieceIndex).toBe(0);
    });

    it("should create empty board", () => {
      expect(player.board).toHaveLength(20);
      expect(player.board[0]).toHaveLength(10);
      expect(player.board.every((row) => row.every((cell) => cell === 0))).toBe(
        true
      );
    });
  });

  describe("reset", () => {
    it("should reset all game state", () => {
      player.score = 1000;
      player.linesCleared = 10;
      player.isPlaying = true;
      player.isEliminated = true;
      player.currentPieceIndex = 5;
      player.board[5][5] = "#ff0000";

      player.reset();

      expect(player.score).toBe(0);
      expect(player.linesCleared).toBe(0);
      expect(player.isPlaying).toBe(false);
      expect(player.isEliminated).toBe(false);
      expect(player.currentPieceIndex).toBe(0);
      expect(player.board[5][5]).toBe(0);
    });

    it("should return this for chaining", () => {
      expect(player.reset()).toBe(player);
    });
  });

  describe("setHost", () => {
    it("should set host status", () => {
      player.setHost(true);
      expect(player.isHost).toBe(true);

      player.setHost(false);
      expect(player.isHost).toBe(false);
    });

    it("should return this for chaining", () => {
      expect(player.setHost(true)).toBe(player);
    });
  });

  describe("startPlaying", () => {
    it("should set playing state", () => {
      player.startPlaying();
      expect(player.isPlaying).toBe(true);
      expect(player.isEliminated).toBe(false);
    });
  });

  describe("eliminate", () => {
    it("should mark player as eliminated", () => {
      player.startPlaying();
      player.eliminate();

      expect(player.isPlaying).toBe(false);
      expect(player.isEliminated).toBe(true);
    });
  });

  describe("updateBoard", () => {
    it("should update board", () => {
      const newBoard = player.createEmptyBoard();
      newBoard[0][0] = "#ff0000";

      player.updateBoard(newBoard);

      expect(player.board[0][0]).toBe("#ff0000");
    });
  });

  describe("incrementPieceIndex", () => {
    it("should increment piece index", () => {
      player.incrementPieceIndex();
      expect(player.currentPieceIndex).toBe(1);

      player.incrementPieceIndex();
      expect(player.currentPieceIndex).toBe(2);
    });
  });

  describe("addScore", () => {
    it("should add correct score for lines", () => {
      player.addScore(1);
      expect(player.score).toBe(100);
      expect(player.linesCleared).toBe(1);

      player.addScore(2);
      expect(player.score).toBe(400);
      expect(player.linesCleared).toBe(3);

      player.addScore(3);
      expect(player.score).toBe(900);

      player.addScore(4);
      expect(player.score).toBe(1700);
    });

    it("should handle invalid line count", () => {
      player.addScore(0);
      expect(player.score).toBe(0);

      player.addScore(5);
      expect(player.score).toBe(0);
    });
  });

  describe("addPenaltyLines", () => {
    it("should add penalty lines at bottom", () => {
      player.addPenaltyLines(2);

      expect(player.board[18].every((cell) => cell === -1)).toBe(true);
      expect(player.board[19].every((cell) => cell === -1)).toBe(true);
    });

    it("should shift existing content up", () => {
      player.board[19][0] = "#ff0000";
      player.addPenaltyLines(1);

      expect(player.board[18][0]).toBe("#ff0000");
      expect(player.board[19].every((cell) => cell === -1)).toBe(true);
    });
  });

  describe("getSpectrum", () => {
    it("should return correct spectrum for empty board", () => {
      const spectrum = player.getSpectrum();
      expect(spectrum).toHaveLength(10);
      expect(spectrum.every((h) => h === 20)).toBe(true);
    });

    it("should return correct heights", () => {
      player.board[5][0] = "#ff0000";
      player.board[10][5] = "#ff0000";

      const spectrum = player.getSpectrum();

      expect(spectrum[0]).toBe(5);
      expect(spectrum[5]).toBe(10);
    });
  });

  describe("toJSON", () => {
    it("should serialize to JSON", () => {
      player.setHost(true);
      player.score = 500;
      player.linesCleared = 5;

      const json = player.toJSON();

      expect(json.id).toBe(player.id);
      expect(json.name).toBe("TestPlayer");
      expect(json.isHost).toBe(true);
      expect(json.score).toBe(500);
      expect(json.linesCleared).toBe(5);
      expect(json.spectrum).toBeDefined();
      expect(json.board).toBeUndefined();
      expect(json.socketId).toBeUndefined();
    });
  });

  describe("toFullJSON", () => {
    it("should include board and piece index", () => {
      const json = player.toFullJSON();

      expect(json.board).toBeDefined();
      expect(json.currentPieceIndex).toBe(0);
    });
  });
});
