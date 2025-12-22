import { describe, it, expect, vi, beforeEach } from "vitest";
import { Piece, SHAPES, SHAPE_NAMES } from "../../server/models/Piece.js";

describe("Piece Model", () => {
  describe("constructor", () => {
    it("should create piece with default values", () => {
      const piece = new Piece("I");
      expect(piece.type).toBe("I");
      expect(piece.x).toBe(3);
      expect(piece.y).toBe(0);
      expect(piece.rotation).toBe(0);
      expect(piece.color).toBe("#00f0f0");
    });

    it("should create piece with custom position", () => {
      const piece = new Piece("T", 5, 10, 2);
      expect(piece.x).toBe(5);
      expect(piece.y).toBe(10);
      expect(piece.rotation).toBe(2);
    });

    it("should create random piece if no type specified", () => {
      const piece = new Piece();
      expect(SHAPE_NAMES).toContain(piece.type);
    });
  });

  describe("getShape", () => {
    it("should return correct shape matrix", () => {
      const piece = new Piece("I", 0, 0, 0);
      const shape = piece.getShape();
      expect(shape).toEqual(SHAPES.I.rotations[0]);
    });

    it("should return rotated shape", () => {
      const piece = new Piece("T", 0, 0, 1);
      const shape = piece.getShape();
      expect(shape).toEqual(SHAPES.T.rotations[1]);
    });
  });

  describe("clone", () => {
    it("should create identical copy", () => {
      const piece = new Piece("L", 5, 10, 2);
      const clone = piece.clone();

      expect(clone.type).toBe(piece.type);
      expect(clone.x).toBe(piece.x);
      expect(clone.y).toBe(piece.y);
      expect(clone.rotation).toBe(piece.rotation);
    });

    it("should not affect original when modifying clone", () => {
      const piece = new Piece("S");
      const clone = piece.clone();
      clone.moveRight();

      expect(piece.x).toBe(3);
      expect(clone.x).toBe(4);
    });
  });

  describe("rotate", () => {
    it("should rotate clockwise", () => {
      const piece = new Piece("T");
      piece.rotate(1);
      expect(piece.rotation).toBe(1);
    });

    it("should rotate counter-clockwise", () => {
      const piece = new Piece("T");
      piece.rotate(-1);
      expect(piece.rotation).toBe(3);
    });

    it("should wrap around", () => {
      const piece = new Piece("T", 0, 0, 3);
      piece.rotate(1);
      expect(piece.rotation).toBe(0);
    });

    it("should return this for chaining", () => {
      const piece = new Piece("T");
      expect(piece.rotate(1)).toBe(piece);
    });
  });

  describe("movement", () => {
    it("should move left", () => {
      const piece = new Piece("I", 5, 0);
      piece.moveLeft();
      expect(piece.x).toBe(4);
    });

    it("should move right", () => {
      const piece = new Piece("I", 5, 0);
      piece.moveRight();
      expect(piece.x).toBe(6);
    });

    it("should move down", () => {
      const piece = new Piece("I", 5, 0);
      piece.moveDown();
      expect(piece.y).toBe(1);
    });
  });

  describe("toJSON", () => {
    it("should serialize to JSON", () => {
      const piece = new Piece("Z", 4, 5, 2);
      const json = piece.toJSON();

      expect(json.type).toBe("Z");
      expect(json.x).toBe(4);
      expect(json.y).toBe(5);
      expect(json.rotation).toBe(2);
      expect(json.color).toBe("#f00000");
    });
  });

  describe("fromJSON", () => {
    it("should deserialize from JSON", () => {
      const json = { type: "J", x: 2, y: 8, rotation: 3 };
      const piece = Piece.fromJSON(json);

      expect(piece.type).toBe("J");
      expect(piece.x).toBe(2);
      expect(piece.y).toBe(8);
      expect(piece.rotation).toBe(3);
    });
  });

  describe("static methods", () => {
    it("getRandomType should return valid type", () => {
      const type = Piece.getRandomType();
      expect(SHAPE_NAMES).toContain(type);
    });

    it("getShapeData should return shape info", () => {
      const data = Piece.getShapeData("O");
      expect(data.color).toBe("#f0f000");
      expect(data.rotations).toHaveLength(4);
    });
  });
});

describe("SHAPES constant", () => {
  it("should have all 7 tetriminos", () => {
    expect(SHAPE_NAMES).toEqual(["I", "O", "T", "S", "Z", "J", "L"]);
  });

  it("each shape should have 4 rotations", () => {
    SHAPE_NAMES.forEach((name) => {
      expect(SHAPES[name].rotations).toHaveLength(4);
    });
  });

  it("each rotation should be 4x4 matrix", () => {
    SHAPE_NAMES.forEach((name) => {
      SHAPES[name].rotations.forEach((rotation) => {
        expect(rotation).toHaveLength(4);
        rotation.forEach((row) => {
          expect(row).toHaveLength(4);
        });
      });
    });
  });
});
