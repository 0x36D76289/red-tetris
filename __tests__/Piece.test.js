const Piece = require("../server/game/Piece");

describe("Piece Class", () => {
  describe("constructor", () => {
    it("should create a piece with correct default properties", () => {
      const piece = new Piece("I");

      expect(piece.type).toBe("I");
      expect(piece.rotation).toBe(0);
      expect(piece.x).toBe(3);
      expect(piece.y).toBe(0);
    });

    it("should create a random piece if no type provided", () => {
      const piece = new Piece();

      expect(Piece.PIECE_TYPES).toContain(piece.type);
    });
  });

  describe("getShape", () => {
    it("should return correct shape for type and rotation", () => {
      const piece = new Piece("O");
      const shape = piece.getShape();

      expect(shape).toEqual([
        [1, 1],
        [1, 1],
      ]);
    });
  });

  describe("rotate", () => {
    it("should rotate piece", () => {
      const piece = new Piece("I");

      piece.rotate();

      expect(piece.rotation).toBe(1);
    });

    it("should wrap rotation to 0 after 3", () => {
      const piece = new Piece("I");

      piece.rotate();
      piece.rotate();
      piece.rotate();
      piece.rotate();

      expect(piece.rotation).toBe(0);
    });
  });

  describe("moveLeft", () => {
    it("should move piece left", () => {
      const piece = new Piece("I");

      piece.moveLeft();

      expect(piece.x).toBe(2);
    });
  });

  describe("moveRight", () => {
    it("should move piece right", () => {
      const piece = new Piece("I");

      piece.moveRight();

      expect(piece.x).toBe(4);
    });
  });

  describe("moveDown", () => {
    it("should move piece down", () => {
      const piece = new Piece("I");

      piece.moveDown();

      expect(piece.y).toBe(1);
    });
  });

  describe("clone", () => {
    it("should create a deep copy of the piece", () => {
      const piece = new Piece("T");
      piece.x = 5;
      piece.y = 10;
      piece.rotation = 2;

      const cloned = piece.clone();

      expect(cloned).not.toBe(piece);
      expect(cloned.type).toBe(piece.type);
      expect(cloned.x).toBe(piece.x);
      expect(cloned.y).toBe(piece.y);
      expect(cloned.rotation).toBe(piece.rotation);
    });
  });

  describe("serialize", () => {
    it("should return serialized piece data", () => {
      const piece = new Piece("S");
      piece.x = 4;
      piece.y = 5;
      piece.rotation = 1;

      const serialized = piece.serialize();

      expect(serialized).toEqual({
        type: "S",
        rotation: 1,
        x: 4,
        y: 5,
      });
    });
  });

  describe("createFromType", () => {
    it("should create a piece from type", () => {
      const piece = Piece.createFromType("L");

      expect(piece.type).toBe("L");
      expect(piece instanceof Piece).toBe(true);
    });
  });
});
