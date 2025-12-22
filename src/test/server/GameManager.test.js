import { describe, it, expect, beforeEach } from "vitest";
import { GameManager, GameError } from "../../server/GameManager.js";

describe("GameManager", () => {
  let manager;

  beforeEach(() => {
    manager = new GameManager();
  });

  describe("createGame", () => {
    it("should create new game", () => {
      const game = manager.createGame("room1");

      expect(game).toBeDefined();
      expect(game.roomName).toBe("room1");
    });

    it("should return existing game if already exists", () => {
      const game1 = manager.createGame("room1");
      const game2 = manager.createGame("room1");

      expect(game1).toBe(game2);
    });
  });

  describe("getGame", () => {
    it("should return game by room name", () => {
      const created = manager.createGame("room1");
      const found = manager.getGame("room1");

      expect(found).toBe(created);
    });

    it("should return undefined for non-existent room", () => {
      expect(manager.getGame("invalid")).toBeUndefined();
    });
  });

  describe("getOrCreateGame", () => {
    it("should create game if not exists", () => {
      const game = manager.getOrCreateGame("newRoom");
      expect(game.roomName).toBe("newRoom");
    });

    it("should return existing game", () => {
      const created = manager.createGame("room1");
      const found = manager.getOrCreateGame("room1");

      expect(found).toBe(created);
    });
  });

  describe("joinGame", () => {
    it("should create game and add player", () => {
      const { game, player } = manager.joinGame("room1", "Player1", "socket1");

      expect(game.roomName).toBe("room1");
      expect(player.name).toBe("Player1");
      expect(game.players.has(player.id)).toBe(true);
    });

    it("should add player to existing game", () => {
      manager.joinGame("room1", "Player1", "socket1");
      const { game, player } = manager.joinGame("room1", "Player2", "socket2");

      expect(game.players.size).toBe(2);
      expect(player.name).toBe("Player2");
    });

    it("should throw error for duplicate player name", () => {
      manager.joinGame("room1", "Player1", "socket1");

      expect(() => {
        manager.joinGame("room1", "Player1", "socket2");
      }).toThrow(GameError);
    });
  });

  describe("leaveGame", () => {
    it("should remove player from game", () => {
      const { game } = manager.joinGame("room1", "Player1", "socket1");
      manager.joinGame("room1", "Player2", "socket2");

      manager.leaveGame("room1", "socket1");

      expect(game.players.size).toBe(1);
    });

    it("should remove empty game", () => {
      manager.joinGame("room1", "Player1", "socket1");
      manager.leaveGame("room1", "socket1");

      expect(manager.getGame("room1")).toBeUndefined();
    });

    it("should return null for non-existent room", () => {
      expect(manager.leaveGame("invalid", "socket1")).toBeNull();
    });
  });

  describe("handleDisconnect", () => {
    it("should find and remove player", () => {
      manager.joinGame("room1", "Player1", "socket1");
      manager.joinGame("room1", "Player2", "socket2");

      const result = manager.handleDisconnect("socket1");

      expect(result).toBeDefined();
      expect(result.players.size).toBe(1);
    });

    it("should return null for unknown socket", () => {
      expect(manager.handleDisconnect("invalid")).toBeNull();
    });
  });

  describe("findGameBySocketId", () => {
    it("should find game and player", () => {
      const { game: created, player: createdPlayer } = manager.joinGame(
        "room1",
        "Player1",
        "socket1"
      );

      const result = manager.findGameBySocketId("socket1");

      expect(result.game).toBe(created);
      expect(result.player).toBe(createdPlayer);
    });

    it("should return null for unknown socket", () => {
      expect(manager.findGameBySocketId("invalid")).toBeNull();
    });
  });

  describe("getAllGames", () => {
    it("should return all games as JSON", () => {
      manager.joinGame("room1", "Player1", "socket1");
      manager.joinGame("room2", "Player2", "socket2");

      const games = manager.getAllGames();

      expect(games).toHaveLength(2);
      expect(games[0].roomName).toBeDefined();
    });

    it("should return empty array when no games", () => {
      expect(manager.getAllGames()).toHaveLength(0);
    });
  });
});
