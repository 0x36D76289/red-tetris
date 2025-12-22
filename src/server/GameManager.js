import { Game, GameError } from "./models/Game.js";
import { Player } from "./models/Player.js";
import { Piece } from "./models/Piece.js";

class GameManager {
  constructor() {
    this.games = new Map();
  }

  createGame(roomName) {
    if (this.games.has(roomName)) {
      return this.games.get(roomName);
    }
    const game = new Game(roomName);
    this.games.set(roomName, game);
    return game;
  }

  getGame(roomName) {
    return this.games.get(roomName);
  }

  getOrCreateGame(roomName) {
    return this.getGame(roomName) || this.createGame(roomName);
  }

  removeGame(roomName) {
    this.games.delete(roomName);
  }

  joinGame(roomName, playerName, socketId) {
    const game = this.getOrCreateGame(roomName);

    for (const player of game.players.values()) {
      if (player.name === playerName) {
        throw new GameError(
          `Player name "${playerName}" is already taken in this room`
        );
      }
    }

    const player = new Player(playerName, socketId);
    game.addPlayer(player);

    return { game, player };
  }

  leaveGame(roomName, socketId) {
    const game = this.games.get(roomName);
    if (!game) return null;

    const player = game.getPlayerBySocketId(socketId);
    if (!player) return null;

    game.removePlayer(player.id);

    if (game.players.size === 0) {
      this.games.delete(roomName);
      return null;
    }

    return game;
  }

  handleDisconnect(socketId) {
    for (const [roomName, game] of this.games.entries()) {
      const player = game.getPlayerBySocketId(socketId);
      if (player) {
        return this.leaveGame(roomName, socketId);
      }
    }
    return null;
  }

  findGameBySocketId(socketId) {
    for (const game of this.games.values()) {
      const player = game.getPlayerBySocketId(socketId);
      if (player) {
        return { game, player };
      }
    }
    return null;
  }

  getAllGames() {
    return Array.from(this.games.values()).map((g) => g.toJSON());
  }
}

export { GameManager, Game, GameError, Player, Piece };
