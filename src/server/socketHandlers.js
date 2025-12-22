import { GameError } from "./GameManager.js";

const setupSocketHandlers = (io, gameManager) => {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", ({ roomName, playerName }, callback) => {
      try {
        const { game, player } = gameManager.joinGame(
          roomName,
          playerName,
          socket.id
        );
        socket.join(roomName);

        io.to(roomName).emit("game:update", game.toJSON());
        io.to(roomName).emit("player:joined", player.toJSON());

        callback({
          success: true,
          game: game.toJSON(),
          player: player.toFullJSON(),
        });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on("leave", ({ roomName }) => {
      const game = gameManager.leaveGame(roomName, socket.id);
      socket.leave(roomName);

      if (game) {
        io.to(roomName).emit("game:update", game.toJSON());
        io.to(roomName).emit("player:left", { socketId: socket.id });
      }
    });

    socket.on("game:start", ({ roomName }, callback) => {
      try {
        const game = gameManager.getGame(roomName);
        if (!game) {
          return callback({ success: false, error: "Game not found" });
        }

        const player = game.getPlayerBySocketId(socket.id);
        if (!player || !player.isHost) {
          return callback({
            success: false,
            error: "Only the host can start the game",
          });
        }

        game.start();

        const initialPieces = [];
        for (let i = 0; i < 5; i++) {
          initialPieces.push(game.getPiece(i).toJSON());
        }

        io.to(roomName).emit("game:started", {
          game: game.toJSON(),
          pieces: initialPieces,
        });

        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on("game:restart", ({ roomName }, callback) => {
      try {
        const game = gameManager.getGame(roomName);
        if (!game) {
          return callback({ success: false, error: "Game not found" });
        }

        const player = game.getPlayerBySocketId(socket.id);
        if (!player || !player.isHost) {
          return callback({
            success: false,
            error: "Only the host can restart the game",
          });
        }

        game.restart();
        io.to(roomName).emit("game:restarted", game.toJSON());
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on("piece:next", ({ roomName, pieceIndex }, callback) => {
      const game = gameManager.getGame(roomName);
      if (!game) {
        return callback({ success: false, error: "Game not found" });
      }

      const piece = game.getPiece(pieceIndex);
      callback({ success: true, piece: piece.toJSON() });
    });

    socket.on("board:update", ({ roomName, board }) => {
      const game = gameManager.getGame(roomName);
      if (!game) return;

      const player = game.getPlayerBySocketId(socket.id);
      if (!player) return;

      player.updateBoard(board);

      socket.to(roomName).emit("spectrum:update", {
        playerId: player.id,
        spectrum: player.getSpectrum(),
      });
    });

    socket.on("lines:cleared", ({ roomName, lineCount }) => {
      const game = gameManager.getGame(roomName);
      if (!game) return;

      const player = game.getPlayerBySocketId(socket.id);
      if (!player) return;

      player.addScore(lineCount);

      if (lineCount > 1) {
        game.distributePenaltyLines(player.id, lineCount);

        io.to(roomName).emit("penalty:add", {
          fromPlayerId: player.id,
          lineCount: lineCount - 1,
        });
      }

      io.to(roomName).emit("game:update", game.toJSON());
    });

    socket.on("player:eliminated", ({ roomName }) => {
      const game = gameManager.getGame(roomName);
      if (!game) return;

      const player = game.getPlayerBySocketId(socket.id);
      if (!player) return;

      game.eliminatePlayer(player.id);

      io.to(roomName).emit("player:eliminated", { playerId: player.id });
      io.to(roomName).emit("game:update", game.toJSON());

      if (game.isFinished) {
        io.to(roomName).emit("game:over", {
          winner: game.winner ? game.winner.toJSON() : null,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);

      const result = gameManager.findGameBySocketId(socket.id);
      if (result) {
        const { game } = result;
        const roomName = game.roomName;

        const updatedGame = gameManager.leaveGame(roomName, socket.id);

        if (updatedGame) {
          io.to(roomName).emit("game:update", updatedGame.toJSON());
          io.to(roomName).emit("player:left", { socketId: socket.id });

          if (updatedGame.isFinished) {
            io.to(roomName).emit("game:over", {
              winner: updatedGame.winner ? updatedGame.winner.toJSON() : null,
            });
          }
        }
      }
    });
  });
};

export { setupSocketHandlers };
