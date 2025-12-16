require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const GameManager = require("./game/GameManager");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "development" ? "http://localhost:8080" : false,
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

const gameManager = new GameManager(io);

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join_game", (data) => {
    gameManager.handleJoinGame(socket, data);
  });

  socket.on("start_game", (data) => {
    gameManager.handleStartGame(socket, data);
  });

  socket.on("player_move", (data) => {
    gameManager.handlePlayerMove(socket, data);
  });

  socket.on("player_rotate", (data) => {
    gameManager.handlePlayerRotate(socket, data);
  });

  socket.on("player_drop", (data) => {
    gameManager.handlePlayerDrop(socket, data);
  });

  socket.on("line_cleared", (data) => {
    gameManager.handleLineCleared(socket, data);
  });

  socket.on("game_over", (data) => {
    gameManager.handleGameOver(socket, data);
  });

  socket.on("request_next_piece", () => {
    gameManager.requestNextPiece(socket);
  });

  socket.on("leave_game", () => {
    gameManager.handleLeaveGame(socket);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    gameManager.handleDisconnect(socket);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
