import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = () => (dispatch) => {
  const isProd =
    typeof import.meta !== "undefined"
      ? Boolean(import.meta.env?.PROD)
      : process.env.NODE_ENV === "production";
  const socketUrl = isProd ? window.location.origin : "http://localhost:3000";

  socket = io(socketUrl);

  socket.on("connect", () => {
    console.log("Socket connected");
    dispatch({ type: "SOCKET_CONNECTED", payload: socket });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    dispatch({ type: "SOCKET_DISCONNECTED" });
  });

  // Game events
  socket.on("join_success", (data) => {
    dispatch({ type: "JOIN_SUCCESS", payload: data });
  });

  socket.on("join_error", (data) => {
    dispatch({ type: "JOIN_ERROR", payload: data });
  });

  socket.on("game_state_update", (data) => {
    dispatch({ type: "GAME_STATE_UPDATE", payload: data });
  });

  socket.on("game_started", (data) => {
    dispatch({ type: "GAME_STARTED", payload: data });
  });

  socket.on("game_ended", (data) => {
    dispatch({ type: "GAME_ENDED", payload: data });
  });

  socket.on("host_assigned", () => {
    dispatch({ type: "HOST_ASSIGNED" });
  });

  socket.on("spectrums_update", (data) => {
    dispatch({ type: "SPECTRUMS_UPDATE", payload: data });
  });

  socket.on("next_piece", (data) => {
    dispatch({ type: "NEXT_PIECE", payload: data });
  });

  socket.on("penalty_received", (data) => {
    dispatch({ type: "PENALTY_RECEIVED", payload: data });
  });

  socket.on("game_error", (data) => {
    dispatch({ type: "JOIN_ERROR", payload: data });
  });
};

export const joinGame = (roomName, playerName) => () => {
  if (socket) {
    socket.emit("join_game", { roomName, playerName });
  }
};

export const startGame = () => () => {
  if (socket) {
    socket.emit("start_game");
  }
};

export const leaveGame = () => (dispatch) => {
  if (socket) {
    socket.emit("leave_game");
  }
  dispatch({ type: "LEAVE_GAME" });
};

export const playerMove = (direction) => () => {
  if (socket) {
    socket.emit("player_move", { direction });
  }
};

export const playerRotate = () => () => {
  if (socket) {
    socket.emit("player_rotate");
  }
};

export const playerDrop = (type) => () => {
  if (socket) {
    socket.emit("player_drop", { type });
  }
};

export const lineCleared = (linesCleared, field) => () => {
  if (socket) {
    socket.emit("line_cleared", { linesCleared, field });
  }
};

export const gameOver = () => (dispatch) => {
  if (socket) {
    socket.emit("game_over");
  }
  dispatch({ type: "GAME_OVER" });
};

export const requestNextPiece = () => () => {
  if (socket) {
    socket.emit("request_next_piece");
  }
};

export const usePiece = () => (dispatch) => {
  dispatch({ type: "USE_PIECE" });
};

export const getSocket = () => socket;
