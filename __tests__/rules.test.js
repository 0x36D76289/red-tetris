const {
  applyPieceLock,
  createEmptyField,
  calculateSpectrum,
} = require("../server/game/rules");

describe("server/game/rules", () => {
  test("applyPieceLock merges a valid piece without clearing lines", () => {
    const field = createEmptyField();
    const piece = { type: "I", x: 3, y: 0, rotation: 0 };

    const result = applyPieceLock(field, piece);

    expect(result.valid).toBe(true);
    expect(result.linesCleared).toBe(0);
    expect(result.gameOver).toBe(false);
    // Blocks should land on row index 1 (20 - 1 = 19 height)
    const expectedSpectrum = Array(10).fill(0);
    expectedSpectrum[3] = 19;
    expectedSpectrum[4] = 19;
    expectedSpectrum[5] = 19;
    expectedSpectrum[6] = 19;
    expect(result.spectrum).toEqual(expectedSpectrum);
  });

  test("applyPieceLock clears filled lines and keeps game alive", () => {
    const field = createEmptyField();
    // Fill bottom row except last two cells
    field[19] = [
      1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
    ];
    const piece = { type: "O", x: 8, y: 18, rotation: 0 };

    const result = applyPieceLock(field, piece);

    expect(result.valid).toBe(true);
    expect(result.linesCleared).toBe(1);
    expect(result.gameOver).toBe(false);
    expect(result.field[19].slice(0, 8).every((cell) => cell === 0)).toBe(
      true
    );
    expect(result.field[19][8]).toBeGreaterThan(0);
    expect(result.field[19][9]).toBeGreaterThan(0);
  });

  test("applyPieceLock flags invalid placement", () => {
    const field = createEmptyField();
    const piece = { type: "T", x: -1, y: 0, rotation: 0 };

    const result = applyPieceLock(field, piece);

    expect(result.valid).toBe(false);
    expect(result.linesCleared).toBe(0);
  });

  test("applyPieceLock detects game over when top row is occupied", () => {
    const field = createEmptyField();
    const piece = { type: "O", x: 0, y: 0, rotation: 0 };

    const result = applyPieceLock(field, piece);

    expect(result.valid).toBe(true);
    expect(result.gameOver).toBe(true);
  });

  test("createEmptyField and calculateSpectrum produce expected shapes", () => {
    const field = createEmptyField();
    expect(field.length).toBe(20);
    expect(field.every((row) => row.length === 10)).toBe(true);

    // Spectrum should be zeroed for empty field
    expect(calculateSpectrum(field)).toEqual(Array(10).fill(0));
  });
});
