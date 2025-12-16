const Player = require("./Player");
const Piece = require("./Piece");

function Game(roomName, io) {
  this.roomName = roomName;
  this.io = io;
  this.players = new Map(); // socketId Player
  this.isStarted = false;
  this.isFinished = false;
  this.pieceSequence = [];
  this.currentPieceIndex = 0;
}

Game.prototype.addPlayer = function (socketId, playerName) {
  if (this.isStarted) {
    return { success: false, error: "Game already started" };
  }

  const nameExists = Array.from(this.players.values()).some(
    (player) => player.name === playerName
  );

  if (nameExists) {
    return { success: false, error: "Name already taken" };
  }

  const isHost = this.players.size === 0;
  const player = new Player(socketId, playerName, isHost);
  this.players.set(socketId, player);

  this.io.in(socketId).socketsJoin(this.roomName);

  return { success: true, player, isHost };
};

Game.prototype.removePlayer = function (socketId) {
  const player = this.players.get(socketId);
  if (!player) return;

  this.players.delete(socketId);

  if (player.isHost && this.players.size > 0) {
    const newHost = Array.from(this.players.values())[0];
    newHost.isHost = true;

    this.io.to(newHost.socketId).emit("host_assigned");
  }

  if (this.isStarted && this.getAlivePlayers().length <= 1) {
    this.endGame();
  }

  this.broadcastGameState();
};

Game.prototype.start = function () {
  if (this.isStarted) {
    return { success: false, error: "Game already started" };
  }

  if (this.players.size === 0) {
    return { success: false, error: "No players in game" };
  }

  this.isStarted = true;
  this.isFinished = false;
  this.pieceSequence = [];
  this.currentPieceIndex = 0;
  this.generatePieceSequence(100);

  this.players.forEach((player) => player.reset());

  return { success: true };
};

Game.prototype.generatePieceSequence = function (count) {
  for (let i = 0; i < count; i++) {
    const pieceType =
      Piece.PIECE_TYPES[Math.floor(Math.random() * Piece.PIECE_TYPES.length)];
    this.pieceSequence.push(pieceType);
  }
};

Game.prototype.getNextPieces = function (startIndex, count) {
  if (startIndex + count > this.pieceSequence.length) {
    this.generatePieceSequence(50);
  }

  return this.pieceSequence.slice(startIndex, startIndex + count);
};

Game.prototype.playerCompletedLines = function (socketId, linesCleared) {
  const player = this.players.get(socketId);
  if (!player || !this.isStarted) return;

  if (linesCleared > 1) {
    const penaltyCount = linesCleared - 1;

    this.players.forEach((otherPlayer, otherSocketId) => {
      if (otherSocketId !== socketId && otherPlayer.isAlive) {
        otherPlayer.addPenaltyLines(penaltyCount);

        this.io.to(otherSocketId).emit("penalty_received", {
          count: penaltyCount,
          field: otherPlayer.field,
        });
      }
    });
  }

  player.updateSpectrum();
  this.broadcastSpectrums();
};

Game.prototype.playerDied = function (socketId) {
  const player = this.players.get(socketId);
  if (!player) return;

  player.markDead();

  const alivePlayers = this.getAlivePlayers();

  if (alivePlayers.length <= 1) {
    this.endGame();
  }
};

Game.prototype.getAlivePlayers = function () {
  return Array.from(this.players.values()).filter((p) => p.isAlive);
};

Game.prototype.endGame = function () {
  this.isFinished = true;
  this.isStarted = false;

  const alivePlayers = this.getAlivePlayers();
  const winner = alivePlayers.length === 1 ? alivePlayers[0] : null;

  this.io.to(this.roomName).emit("game_ended", {
    winner: winner ? winner.name : null,
  });

  this.broadcastGameState();
};

Game.prototype.broadcastGameState = function () {
  const playersState = Array.from(this.players.values()).map((p) =>
    p.getState()
  );

  this.io.to(this.roomName).emit("game_state_update", {
    players: playersState,
    isStarted: this.isStarted,
    roomName: this.roomName,
  });
};

Game.prototype.broadcastSpectrums = function () {
  const spectrums = {};

  this.players.forEach((player) => {
    spectrums[player.name] = player.spectrum;
  });

  this.io.to(this.roomName).emit("spectrums_update", spectrums);
};

Game.prototype.isEmpty = function () {
  return this.players.size === 0;
};

module.exports = Game;
