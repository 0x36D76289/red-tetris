const Player = require("../server/game/Player");

describe("Player Class", () => {
  describe("constructor", () => {
    it("should create a player with correct properties", () => {
      const player = new Player("socket123", "TestPlayer", true);

      expect(player.socketId).toBe("socket123");
      expect(player.name).toBe("TestPlayer");
      expect(player.isHost).toBe(true);
      expect(player.isAlive).toBe(true);
      expect(player.field).toHaveLength(20);
      expect(player.spectrum).toHaveLength(10);
    });

    it("should default isHost to false", () => {
      const player = new Player("socket123", "TestPlayer");

      expect(player.isHost).toBe(false);
    });
  });

  describe("initializeField", () => {
    it("should create a 20x10 empty field", () => {
      const player = new Player("socket123", "TestPlayer");
      const field = player.initializeField();

      expect(field).toHaveLength(20);
      expect(field[0]).toHaveLength(10);
      expect(field.every((row) => row.every((cell) => cell === 0))).toBe(true);
    });
  });

  describe("updateSpectrum", () => {
    it("should calculate spectrum correctly", () => {
      const player = new Player("socket123", "TestPlayer");
      player.field[19][0] = 1;
      player.field[18][0] = 1;
      player.field[19][1] = 1;

      player.updateSpectrum();

      expect(player.spectrum[0]).toBe(2);
      expect(player.spectrum[1]).toBe(1);
      expect(player.spectrum[2]).toBe(0);
    });
  });

  describe("markDead", () => {
    it("should mark player as dead", () => {
      const player = new Player("socket123", "TestPlayer");

      player.markDead();

      expect(player.isAlive).toBe(false);
    });
  });

  describe("reset", () => {
    it("should reset player state", () => {
      const player = new Player("socket123", "TestPlayer");
      player.markDead();
      player.field[19][0] = 1;

      player.reset();

      expect(player.isAlive).toBe(true);
      expect(player.field.every((row) => row.every((cell) => cell === 0))).toBe(
        true
      );
    });
  });

  describe("addPenaltyLines", () => {
    it("should add penalty lines at bottom", () => {
      const player = new Player("socket123", "TestPlayer");

      player.addPenaltyLines(2);

      expect(player.field[18].some((cell) => cell === -1)).toBe(true);
      expect(player.field[19].some((cell) => cell === -1)).toBe(true);
    });

    it("should add gap in penalty line", () => {
      const player = new Player("socket123", "TestPlayer");

      player.addPenaltyLines(1);

      const lastRow = player.field[19];
      const gapCount = lastRow.filter((cell) => cell === 0).length;

      expect(gapCount).toBe(1);
    });
  });

  describe("getState", () => {
    it("should return player state", () => {
      const player = new Player("socket123", "TestPlayer", true);
      const state = player.getState();

      expect(state).toEqual({
        socketId: "socket123",
        name: "TestPlayer",
        isHost: true,
        isAlive: true,
        spectrum: expect.any(Array),
      });
    });
  });
});
