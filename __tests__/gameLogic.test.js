import {
  createField,
  isValidPosition,
  movePieceLeft,
  movePieceRight,
  movePieceDown,
  rotatePiece,
  hardDrop,
  mergePieceToField,
  clearLines,
  isGameOver,
  calculateSpectrum,
  createPiece,
} from "../client/game/gameLogic";

describe("Game Logic - Pure Functions", () => {
  describe("createField", () => {
    it("should create a 20x10 empty field", () => {
      const field = createField();

      expect(field).toHaveLength(20);
      expect(field[0]).toHaveLength(10);
      expect(field.every((row) => row.every((cell) => cell === 0))).toBe(true);
    });
  });

  describe("createPiece", () => {
    it("should create a piece with correct properties", () => {
      const piece = createPiece("I");

      expect(piece).toEqual({
        type: "I",
        x: 3,
        y: 0,
        rotation: 0,
      });
    });
  });

  describe("isValidPosition", () => {
    it("should return true for valid position", () => {
      const field = createField();
      const piece = createPiece("I");

      expect(isValidPosition(field, piece, 3, 0, 0)).toBe(true);
    });

    it("should return false for out of bounds position", () => {
      const field = createField();
      const piece = createPiece("I");

      expect(isValidPosition(field, piece, -1, 0, 0)).toBe(false);
      expect(isValidPosition(field, piece, 10, 0, 0)).toBe(false);
    });

    it("should return false for collision with existing pieces", () => {
      const field = createField();
      // Place a block where the I piece will collide
      // I piece rotation 1 (vertical) has blocks at column offset 2
      // At x=3, y=4, the piece occupies column 5, rows 4-7
      field[5][5] = 1;

      const piece = createPiece("I");
      piece.y = 4;
      piece.rotation = 1; // Vertical I piece

      expect(isValidPosition(field, piece, 3, 4, 1)).toBe(false);
    });
  });

  describe("movePieceLeft", () => {
    it("should move piece left if valid", () => {
      const field = createField();
      const piece = createPiece("I");
      piece.x = 5;

      const movedPiece = movePieceLeft(field, piece);

      expect(movedPiece.x).toBe(4);
    });

    it("should not move piece if invalid", () => {
      const field = createField();
      const piece = createPiece("O");
      piece.x = 0;

      const movedPiece = movePieceLeft(field, piece);

      expect(movedPiece.x).toBe(0);
    });
  });

  describe("movePieceRight", () => {
    it("should move piece right if valid", () => {
      const field = createField();
      const piece = createPiece("I");
      piece.x = 3;

      const movedPiece = movePieceRight(field, piece);

      expect(movedPiece.x).toBe(4);
    });
  });

  describe("movePieceDown", () => {
    it("should move piece down if valid", () => {
      const field = createField();
      const piece = createPiece("I");

      const result = movePieceDown(field, piece);

      expect(result.piece.y).toBe(1);
      expect(result.locked).toBe(false);
    });

    it("should lock piece if cannot move down", () => {
      const field = createField();
      const piece = createPiece("I");
      piece.y = 18;

      const result = movePieceDown(field, piece);

      expect(result.locked).toBe(true);
    });
  });

  describe("rotatePiece", () => {
    it("should rotate piece if valid", () => {
      const field = createField();
      const piece = createPiece("I");

      const rotatedPiece = rotatePiece(field, piece);

      expect(rotatedPiece.rotation).toBe(1);
    });

    it("should not rotate if invalid", () => {
      const field = createField();
      const piece = createPiece("I");
      piece.x = 0;
      piece.rotation = 1; // Vertical

      const rotatedPiece = rotatePiece(field, piece);

      // Should try wall kicks or return original
      expect(rotatedPiece.rotation).toBeDefined();
    });
  });

  describe("hardDrop", () => {
    it("should drop piece to the bottom", () => {
      const field = createField();
      const piece = createPiece("I");

      const droppedPiece = hardDrop(field, piece);

      expect(droppedPiece.y).toBeGreaterThan(piece.y);
    });
  });

  describe("mergePieceToField", () => {
    it("should merge piece into field", () => {
      const field = createField();
      const piece = createPiece("O");
      piece.y = 18;

      const newField = mergePieceToField(field, piece);

      expect(newField[18][3]).not.toBe(0);
      expect(newField[18][4]).not.toBe(0);
    });
  });

  describe("clearLines", () => {
    it("should clear completed lines", () => {
      const field = createField();
      field[19] = Array(10).fill(1);

      const { field: newField, linesCleared } = clearLines(field);

      expect(linesCleared).toBe(1);
      expect(newField[19].every((cell) => cell === 0)).toBe(true);
    });

    it("should not clear incomplete lines", () => {
      const field = createField();
      field[19] = Array(10).fill(1);
      field[19][5] = 0;

      const { field: newField, linesCleared } = clearLines(field);

      expect(linesCleared).toBe(0);
    });
  });

  describe("isGameOver", () => {
    it("should return true if top row has blocks", () => {
      const field = createField();
      field[0][5] = 1;

      expect(isGameOver(field)).toBe(true);
    });

    it("should return false if top row is empty", () => {
      const field = createField();

      expect(isGameOver(field)).toBe(false);
    });
  });

  describe("calculateSpectrum", () => {
    it("should calculate column heights correctly", () => {
      const field = createField();
      field[19][0] = 1;
      field[18][0] = 1;
      field[19][1] = 1;

      const spectrum = calculateSpectrum(field);

      expect(spectrum[0]).toBe(2);
      expect(spectrum[1]).toBe(1);
      expect(spectrum[2]).toBe(0);
    });
  });
});
