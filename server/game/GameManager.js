const Game = require("./Game");
const { applyPieceLock, calculateSpectrum } = require("./rules");

function GameManager(io) {
  this.io = io;
  this.games = new Map(); // roomName Game
  this.playerToGame = new Map(); // socketId roomName
}

GameManager.prototype.handleJoinGame = function (socket, data) {
  const { roomName, playerName } = data;

  if (!roomName || !playerName) {
    socket.emit("join_error", { error: "Room name and player name required" });
    return;
  }

  if (this.playerToGame.has(socket.id)) {
    const currentRoom = this.playerToGame.get(socket.id);
    if (currentRoom === roomName) {
      socket.emit("join_error", { error: "Already in this room" });
      return;
    }
    this.handleLeaveGame(socket);
  }

  let game = this.games.get(roomName);
  if (!game) {
    game = new Game(roomName, this.io);
    this.games.set(roomName, game);
  }

  const result = game.addPlayer(socket.id, playerName);

  if (!result.success) {
    socket.emit("join_error", { error: result.error });
    return;
  }

  this.playerToGame.set(socket.id, roomName);

  socket.emit("join_success", {
    roomName,
    playerName,
    isHost: result.isHost,
  });

  game.broadcastGameState();
};

GameManager.prototype.handleStartGame = function (socket, data) {
  const roomName = this.playerToGame.get(socket.id);
  if (!roomName) {
    socket.emit("game_error", { error: "Not in a game" });
    return;
  }

  const game = this.games.get(roomName);
  const player = game.players.get(socket.id);

  if (!player.isHost) {
    socket.emit("game_error", { error: "Only host can start game" });
    return;
  }

  const result = game.start();

  if (!result.success) {
    socket.emit("game_error", { error: result.error });
    return;
  }

  // Send initial pieces to all players
  const initialPieces = game.getNextPieces(game.currentPieceIndex, 5);
  game.currentPieceIndex += initialPieces.length;

  game.players.forEach((player, socketId) => {
    this.io.to(socketId).emit("game_started", {
      pieces: initialPieces,
    });
  });

  game.broadcastGameState();
};

GameManager.prototype.handlePlayerMove = function (socket, data) {
  const roomName = this.playerToGame.get(socket.id);
  if (!roomName) return;

  const game = this.games.get(roomName);
  if (!game) return;

  const player = game.players.get(socket.id);

  if (!player || !player.isAlive || !game.isStarted) return;

  // Client handles piece movement validation
  // Server just tracks spectrum updates if needed
  player.updateSpectrum();
  game.broadcastSpectrums();
};

GameManager.prototype.handlePlayerRotate = function (socket, data) {
  const roomName = this.playerToGame.get(socket.id);
  if (!roomName) return;

  const game = this.games.get(roomName);
  if (!game) return;

  const player = game.players.get(socket.id);

  if (!player || !player.isAlive || !game.isStarted) return;
};

GameManager.prototype.handlePlayerDrop = function (socket, data) {
  const roomName = this.playerToGame.get(socket.id);
  if (!roomName) return;

  const game = this.games.get(roomName);
  if (!game) return;

  const player = game.players.get(socket.id);

  if (!player || !player.isAlive || !game.isStarted) return;
};

GameManager.prototype.handleLineCleared = function (socket, data) {
  const { piece } = data || {};
  const roomName = this.playerToGame.get(socket.id);
  if (!roomName) return;

  const game = this.games.get(roomName);
  if (!game) return;

  const player = game.players.get(socket.id);

  if (!player || !player.isAlive || !game.isStarted) return;

  const result = applyPieceLock(player.field, piece);

  if (!result.valid) {
    socket.emit("game_error", { error: "Invalid piece placement" });
    return;
  }

  player.field = result.field;
  player.spectrum = result.spectrum || calculateSpectrum(player.field);

  if (result.gameOver) {
    game.playerDied(socket.id);
    return;
  }

  game.playerCompletedLines(socket.id, result.linesCleared);
  game.broadcastSpectrums();
};

GameManager.prototype.handleGameOver = function (socket, data) {
  const roomName = this.playerToGame.get(socket.id);
  if (!roomName) return;

  const game = this.games.get(roomName);
  if (!game) return;

  game.playerDied(socket.id);
};

GameManager.prototype.handleLeaveGame = function (socket) {
  const roomName = this.playerToGame.get(socket.id);
  if (!roomName) return;

  const game = this.games.get(roomName);
  if (game) {
    game.removePlayer(socket.id);

    if (game.isEmpty()) {
      this.games.delete(roomName);
    }
  }

  this.playerToGame.delete(socket.id);
  this.io.in(socket.id).socketsLeave(roomName);
};

GameManager.prototype.handleDisconnect = function (socket) {
  this.handleLeaveGame(socket);
};

GameManager.prototype.requestNextPiece = function (socket) {
  const roomName = this.playerToGame.get(socket.id);
  if (!roomName) return;

  const game = this.games.get(roomName);
  if (!game) return;

  const player = game.players.get(socket.id);

  if (!player || !game.isStarted) return;

  const nextPiece = game.getNextPieces(game.currentPieceIndex, 1)[0];
  game.currentPieceIndex++;

  socket.emit("next_piece", { piece: nextPiece });
};

module.exports = GameManager;
