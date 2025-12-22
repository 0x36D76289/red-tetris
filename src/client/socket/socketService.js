import { io } from "socket.io-client";

let socket = null;

const initSocket = () => {
  if (socket) return socket;

  const serverUrl = import.meta.env.PROD
    ? window.location.origin
    : "http://localhost:3004";

  socket = io(serverUrl, {
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
  });

  return socket;
};

const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

const emitWithAck = (event, data) => {
  return new Promise((resolve, reject) => {
    const s = getSocket();
    s.emit(event, data, (response) => {
      if (response.success) {
        resolve(response);
      } else {
        reject(new Error(response.error || "Unknown error"));
      }
    });
  });
};

const joinGame = (roomName, playerName) => {
  return emitWithAck("join", { roomName, playerName });
};

const leaveGame = (roomName) => {
  getSocket().emit("leave", { roomName });
};

const startGame = (roomName) => {
  return emitWithAck("game:start", { roomName });
};

const restartGame = (roomName) => {
  return emitWithAck("game:restart", { roomName });
};

const requestNextPiece = (roomName, pieceIndex) => {
  return emitWithAck("piece:next", { roomName, pieceIndex });
};

const updateBoard = (roomName, board) => {
  getSocket().emit("board:update", { roomName, board });
};

const notifyLinesCleared = (roomName, lineCount) => {
  getSocket().emit("lines:cleared", { roomName, lineCount });
};

const notifyEliminated = (roomName) => {
  getSocket().emit("player:eliminated", { roomName });
};

const onGameUpdate = (callback) => {
  getSocket().on("game:update", callback);
  return () => getSocket().off("game:update", callback);
};

const onPlayerJoined = (callback) => {
  getSocket().on("player:joined", callback);
  return () => getSocket().off("player:joined", callback);
};

const onPlayerLeft = (callback) => {
  getSocket().on("player:left", callback);
  return () => getSocket().off("player:left", callback);
};

const onGameStarted = (callback) => {
  getSocket().on("game:started", callback);
  return () => getSocket().off("game:started", callback);
};

const onGameRestarted = (callback) => {
  getSocket().on("game:restarted", callback);
  return () => getSocket().off("game:restarted", callback);
};

const onSpectrumUpdate = (callback) => {
  getSocket().on("spectrum:update", callback);
  return () => getSocket().off("spectrum:update", callback);
};

const onPenaltyAdd = (callback) => {
  getSocket().on("penalty:add", callback);
  return () => getSocket().off("penalty:add", callback);
};

const onPlayerEliminated = (callback) => {
  getSocket().on("player:eliminated", callback);
  return () => getSocket().off("player:eliminated", callback);
};

const onGameOver = (callback) => {
  getSocket().on("game:over", callback);
  return () => getSocket().off("game:over", callback);
};

export {
  initSocket,
  getSocket,
  joinGame,
  leaveGame,
  startGame,
  restartGame,
  requestNextPiece,
  updateBoard,
  notifyLinesCleared,
  notifyEliminated,
  onGameUpdate,
  onPlayerJoined,
  onPlayerLeft,
  onGameStarted,
  onGameRestarted,
  onSpectrumUpdate,
  onPenaltyAdd,
  onPlayerEliminated,
  onGameOver,
};
