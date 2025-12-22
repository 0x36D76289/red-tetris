import { v4 as uuidv4 } from "uuid";
import { Piece } from "./Piece.js";

class Game {
  constructor(roomName) {
    this.id = uuidv4();
    this.roomName = roomName;
    this.players = new Map();
    this.pieces = [];
    this.isStarted = false;
    this.isFinished = false;
    this.winner = null;
    this.createdAt = Date.now();
  }

  addPlayer(player) {
    if (this.isStarted) {
      throw new GameError("Cannot join a game in progress");
    }

    if (this.players.has(player.id)) {
      throw new GameError("Player already in game");
    }

    if (this.players.size === 0) {
      player.setHost(true);
    }

    this.players.set(player.id, player);
    return this;
  }

  removePlayer(playerId) {
    const player = this.players.get(playerId);
    if (!player) return this;

    const wasHost = player.isHost;
    this.players.delete(playerId);

    if (wasHost && this.players.size > 0) {
      const newHost = this.players.values().next().value;
      newHost.setHost(true);
    }

    if (this.isStarted && !this.isFinished) {
      this.checkGameOver();
    }

    return this;
  }

  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  getPlayerBySocketId(socketId) {
    for (const player of this.players.values()) {
      if (player.socketId === socketId) {
        return player;
      }
    }
    return null;
  }

  getHost() {
    for (const player of this.players.values()) {
      if (player.isHost) {
        return player;
      }
    }
    return null;
  }

  getActivePlayers() {
    return Array.from(this.players.values()).filter(
      (p) => p.isPlaying && !p.isEliminated
    );
  }

  getAllPlayers() {
    return Array.from(this.players.values());
  }

  generatePieces(count = 100) {
    for (let i = 0; i < count; i++) {
      this.pieces.push(new Piece(Piece.getRandomType()));
    }
    return this;
  }

  getPiece(index) {
    while (index >= this.pieces.length) {
      this.pieces.push(new Piece(Piece.getRandomType()));
    }
    return this.pieces[index].clone();
  }

  start() {
    if (this.players.size === 0) {
      throw new GameError("Cannot start game with no players");
    }

    this.isStarted = true;
    this.isFinished = false;
    this.winner = null;
    this.pieces = [];
    this.generatePieces();

    for (const player of this.players.values()) {
      player.reset();
      player.startPlaying();
    }

    return this;
  }

  restart() {
    this.isStarted = false;
    this.isFinished = false;
    this.winner = null;
    this.pieces = [];

    for (const player of this.players.values()) {
      player.reset();
    }

    return this;
  }

  eliminatePlayer(playerId) {
    const player = this.players.get(playerId);
    if (player) {
      player.eliminate();
      this.checkGameOver();
    }
    return this;
  }

  checkGameOver() {
    const activePlayers = this.getActivePlayers();

    if (activePlayers.length === 0) {
      this.isFinished = true;
    } else if (activePlayers.length === 1 && this.players.size > 1) {
      this.isFinished = true;
      this.winner = activePlayers[0];
    }

    return this.isFinished;
  }

  distributePenaltyLines(fromPlayerId, lineCount) {
    const penaltyCount = lineCount - 1;
    if (penaltyCount <= 0) return;

    for (const player of this.players.values()) {
      if (
        player.id !== fromPlayerId &&
        player.isPlaying &&
        !player.isEliminated
      ) {
        player.addPenaltyLines(penaltyCount);
      }
    }
  }

  toJSON() {
    return {
      id: this.id,
      roomName: this.roomName,
      players: Array.from(this.players.values()).map((p) => p.toJSON()),
      isStarted: this.isStarted,
      isFinished: this.isFinished,
      winner: this.winner ? this.winner.toJSON() : null,
      pieceCount: this.pieces.length,
    };
  }
}

class GameError extends Error {
  constructor(message) {
    super(message);
    this.name = "GameError";
  }
}

export { Game, GameError };
