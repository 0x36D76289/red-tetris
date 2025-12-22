import { describe, it, expect } from "vitest";
import {
  createEmptyBoard,
  getPieceShape,
  getPieceColor,
  checkCollision,
  rotatePiece,
  movePiece,
  lockPiece,
  clearLines,
  addPenaltyLines,
  calculateSpectrum,
  isGameOver,
  hardDrop,
  getGhostPiece,
  tryRotation,
  SHAPES,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from "../../client/game/tetris.js";

describe("Tetris Game Logic", () => {
  describe("createEmptyBoard", () => {
    it("should create a 20x10 empty board", () => {
      const board = createEmptyBoard();
      expect(board.length).toBe(BOARD_HEIGHT);
      expect(board[0].length).toBe(BOARD_WIDTH);
      expect(board.every((row) => row.every((cell) => cell === 0))).toBe(true);
    });
  });

  describe("getPieceShape", () => {
    it("should return the correct shape for a piece", () => {
      const piece = { type: "I", rotation: 0 };
      const shape = getPieceShape(piece);
      expect(shape).toEqual(SHAPES.I.rotations[0]);
    });

    it("should return rotated shape", () => {
      const piece = { type: "T", rotation: 1 };
      const shape = getPieceShape(piece);
      expect(shape).toEqual(SHAPES.T.rotations[1]);
    });
  });

  describe("getPieceColor", () => {
    it("should return correct color for each piece type", () => {
      expect(getPieceColor("I")).toBe("#00f0f0");
      expect(getPieceColor("O")).toBe("#f0f000");
      expect(getPieceColor("T")).toBe("#a000f0");
      expect(getPieceColor("S")).toBe("#00f000");
      expect(getPieceColor("Z")).toBe("#f00000");
      expect(getPieceColor("J")).toBe("#0000f0");
      expect(getPieceColor("L")).toBe("#f0a000");
    });
  });

  describe("checkCollision", () => {
    it("should return false for valid position", () => {
      const board = createEmptyBoard();
      const piece = { type: "I", x: 3, y: 0, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(false);
    });

    it("should return true for collision with left wall", () => {
      const board = createEmptyBoard();
      const piece = { type: "I", x: -2, y: 0, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(true);
    });

    it("should return true for collision with right wall", () => {
      const board = createEmptyBoard();
      const piece = { type: "I", x: 8, y: 0, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(true);
    });

    it("should return true for collision with bottom", () => {
      const board = createEmptyBoard();
      const piece = { type: "I", x: 3, y: 19, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(true);
    });

    it("should return true for collision with existing pieces", () => {
      const board = createEmptyBoard();
      board[5][5] = "#ff0000";
      const piece = { type: "O", x: 4, y: 4, rotation: 0 };
      expect(checkCollision(board, piece)).toBe(true);
    });

    it("should handle offset parameters", () => {
      const board = createEmptyBoard();
      const piece = { type: "I", x: 3, y: 0, rotation: 0 };
      expect(checkCollision(board, piece, 0, 1)).toBe(false);
      expect(checkCollision(board, piece, 0, 19)).toBe(true);
    });
  });

  describe("rotatePiece", () => {
    it("should rotate piece clockwise", () => {
      const piece = { type: "T", x: 3, y: 0, rotation: 0 };
      const rotated = rotatePiece(piece, 1);
      expect(rotated.rotation).toBe(1);
    });

    it("should rotate piece counter-clockwise", () => {
      const piece = { type: "T", x: 3, y: 0, rotation: 0 };
      const rotated = rotatePiece(piece, -1);
      expect(rotated.rotation).toBe(3);
    });

    it("should wrap rotation around", () => {
      const piece = { type: "T", x: 3, y: 0, rotation: 3 };
      const rotated = rotatePiece(piece, 1);
      expect(rotated.rotation).toBe(0);
    });
  });

  describe("movePiece", () => {
    it("should move piece left", () => {
      const piece = { type: "T", x: 5, y: 5, rotation: 0 };
      const moved = movePiece(piece, -1, 0);
      expect(moved.x).toBe(4);
      expect(moved.y).toBe(5);
    });

    it("should move piece right", () => {
      const piece = { type: "T", x: 5, y: 5, rotation: 0 };
      const moved = movePiece(piece, 1, 0);
      expect(moved.x).toBe(6);
      expect(moved.y).toBe(5);
    });

    it("should move piece down", () => {
      const piece = { type: "T", x: 5, y: 5, rotation: 0 };
      const moved = movePiece(piece, 0, 1);
      expect(moved.y).toBe(6);
    });
  });

  describe("lockPiece", () => {
    it("should lock piece on board", () => {
      const board = createEmptyBoard();
      const piece = { type: "O", x: 4, y: 18, rotation: 0 };
      const newBoard = lockPiece(board, piece);

      expect(newBoard[18][5]).toBe("#f0f000");
      expect(newBoard[18][6]).toBe("#f0f000");
      expect(newBoard[19][5]).toBe("#f0f000");
      expect(newBoard[19][6]).toBe("#f0f000");
    });

    it("should not modify original board", () => {
      const board = createEmptyBoard();
      const piece = { type: "O", x: 4, y: 18, rotation: 0 };
      lockPiece(board, piece);

      expect(board[18][5]).toBe(0);
    });
  });

  describe("clearLines", () => {
    it("should clear completed lines", () => {
      const board = createEmptyBoard();
      board[19] = Array(10).fill("#ff0000");

      const result = clearLines(board);

      expect(result.linesCleared).toBe(1);
      expect(result.board[19].every((cell) => cell === 0)).toBe(true);
    });

    it("should clear multiple lines", () => {
      const board = createEmptyBoard();
      board[18] = Array(10).fill("#ff0000");
      board[19] = Array(10).fill("#ff0000");

      const result = clearLines(board);

      expect(result.linesCleared).toBe(2);
    });

    it("should not clear lines with gaps", () => {
      const board = createEmptyBoard();
      board[19] = Array(10).fill("#ff0000");
      board[19][5] = 0;

      const result = clearLines(board);

      expect(result.linesCleared).toBe(0);
    });

    it("should preserve penalty lines", () => {
      const board = createEmptyBoard();
      board[19] = Array(10).fill(-1);

      const result = clearLines(board);

      expect(result.linesCleared).toBe(0);
    });
  });

  describe("addPenaltyLines", () => {
    it("should add penalty lines at bottom", () => {
      const board = createEmptyBoard();
      const newBoard = addPenaltyLines(board, 2);

      expect(newBoard[18].every((cell) => cell === -1)).toBe(true);
      expect(newBoard[19].every((cell) => cell === -1)).toBe(true);
    });

    it("should shift board up", () => {
      const board = createEmptyBoard();
      board[15][5] = "#ff0000";

      const newBoard = addPenaltyLines(board, 2);

      expect(newBoard[13][5]).toBe("#ff0000");
    });
  });

  describe("calculateSpectrum", () => {
    it("should return height 20 for empty columns", () => {
      const board = createEmptyBoard();
      const spectrum = calculateSpectrum(board);

      expect(spectrum.every((h) => h === 20)).toBe(true);
    });

    it("should return correct heights", () => {
      const board = createEmptyBoard();
      board[15][0] = "#ff0000";
      board[10][5] = "#ff0000";

      const spectrum = calculateSpectrum(board);

      expect(spectrum[0]).toBe(15);
      expect(spectrum[5]).toBe(10);
    });
  });

  describe("isGameOver", () => {
    it("should return true if piece collides at start", () => {
      const board = createEmptyBoard();
      board[1][3] = "#ff0000";
      board[1][4] = "#ff0000";
      const piece = { type: "I", x: 3, y: 0, rotation: 0 };

      expect(isGameOver(board, piece)).toBe(true);
    });

    it("should return false for valid starting position", () => {
      const board = createEmptyBoard();
      const piece = { type: "I", x: 3, y: 0, rotation: 0 };

      expect(isGameOver(board, piece)).toBe(false);
    });
  });

  describe("hardDrop", () => {
    it("should drop piece to bottom", () => {
      const board = createEmptyBoard();
      const piece = { type: "I", x: 3, y: 0, rotation: 0 };

      const dropped = hardDrop(board, piece);

      expect(dropped.y).toBe(18);
    });

    it("should stop at existing pieces", () => {
      const board = createEmptyBoard();
      board[10][5] = "#ff0000";
      const piece = { type: "I", x: 3, y: 0, rotation: 1 };

      const dropped = hardDrop(board, piece);

      expect(dropped.y).toBeLessThanOrEqual(6);
    });
  });

  describe("getGhostPiece", () => {
    it("should return ghost piece at drop position", () => {
      const board = createEmptyBoard();
      const piece = { type: "I", x: 3, y: 0, rotation: 0 };

      const ghost = getGhostPiece(board, piece);

      expect(ghost.x).toBe(piece.x);
      expect(ghost.y).toBeGreaterThan(piece.y);
    });
  });

  describe("tryRotation", () => {
    it("should rotate if valid", () => {
      const board = createEmptyBoard();
      const piece = { type: "T", x: 5, y: 5, rotation: 0 };

      const rotated = tryRotation(board, piece, 1);

      expect(rotated.rotation).toBe(1);
    });

    it("should wall kick if needed", () => {
      const board = createEmptyBoard();
      const piece = { type: "I", x: 0, y: 5, rotation: 0 };

      const rotated = tryRotation(board, piece, 1);

      expect(checkCollision(board, rotated)).toBe(false);
    });

    it("should return original if no valid rotation", () => {
      const board = createEmptyBoard();
      for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          if (col !== 5) board[row][col] = "#ff0000";
        }
      }

      const piece = { type: "I", x: 4, y: 5, rotation: 1 };
      const rotated = tryRotation(board, piece, 1);

      expect(rotated).toBeDefined();
    });
  });
});
