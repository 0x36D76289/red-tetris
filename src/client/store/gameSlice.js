import { createSlice } from "@reduxjs/toolkit";
import {
  createEmptyBoard,
  checkCollision,
  movePiece,
  tryRotation,
  lockPiece,
  clearLines,
  addPenaltyLines,
  hardDrop,
  isGameOver,
} from "../game/tetris.js";

const initialState = {
  // Connection state
  isConnected: false,
  roomName: null,

  // Player state
  player: null,
  isHost: false,

  // Game state
  game: null,
  isPlaying: false,
  isGameOver: false,

  // Board state
  board: createEmptyBoard(),
  currentPiece: null,
  nextPieces: [],
  pieceIndex: 0,

  // Score
  score: 0,
  linesCleared: 0,
  lastLinesCleared: 0,

  // Other players
  opponents: [],
  spectrums: {},

  // UI state
  error: null,
  winner: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },

    setRoom: (state, action) => {
      state.roomName = action.payload;
    },

    setPlayer: (state, action) => {
      state.player = action.payload;
      state.isHost = action.payload?.isHost || false;
    },

    setGame: (state, action) => {
      state.game = action.payload;
      if (action.payload) {
        state.opponents = action.payload.players.filter(
          (p) => p.id !== state.player?.id
        );
        state.isHost =
          action.payload.players.find((p) => p.id === state.player?.id)
            ?.isHost || false;
      }
    },

    startGame: (state, action) => {
      const { pieces } = action.payload;
      state.isPlaying = true;
      state.isGameOver = false;
      state.board = createEmptyBoard();
      state.score = 0;
      state.linesCleared = 0;
      state.pieceIndex = 0;
      state.nextPieces = pieces;
      state.currentPiece = pieces[0] ? { ...pieces[0], x: 3, y: 0 } : null;
      state.winner = null;
      state.spectrums = {};
    },

    resetGame: (state) => {
      state.isPlaying = false;
      state.isGameOver = false;
      state.board = createEmptyBoard();
      state.currentPiece = null;
      state.nextPieces = [];
      state.pieceIndex = 0;
      state.score = 0;
      state.linesCleared = 0;
      state.winner = null;
      state.spectrums = {};
    },

    setCurrentPiece: (state, action) => {
      state.currentPiece = action.payload;
    },

    addNextPiece: (state, action) => {
      state.nextPieces.push(action.payload);
    },

    moveLeft: (state) => {
      if (!state.currentPiece || !state.isPlaying) return;
      const newPiece = movePiece(state.currentPiece, -1, 0);
      if (!checkCollision(state.board, newPiece)) {
        state.currentPiece = newPiece;
      }
    },

    moveRight: (state) => {
      if (!state.currentPiece || !state.isPlaying) return;
      const newPiece = movePiece(state.currentPiece, 1, 0);
      if (!checkCollision(state.board, newPiece)) {
        state.currentPiece = newPiece;
      }
    },

    moveDown: (state) => {
      if (!state.currentPiece || !state.isPlaying) return;
      const newPiece = movePiece(state.currentPiece, 0, 1);
      if (!checkCollision(state.board, newPiece)) {
        state.currentPiece = newPiece;
      }
    },

    rotate: (state) => {
      if (!state.currentPiece || !state.isPlaying) return;
      const newPiece = tryRotation(state.board, state.currentPiece, 1);
      state.currentPiece = newPiece;
    },

    hardDropPiece: (state) => {
      if (!state.currentPiece || !state.isPlaying) return;
      const droppedPiece = hardDrop(state.board, state.currentPiece);

      state.board = lockPiece(state.board, droppedPiece);

      const result = clearLines(state.board);
      state.board = result.board;
      const newLinesCleared = result.linesCleared;
      state.linesCleared += newLinesCleared;

      const scoreTable = { 1: 100, 2: 300, 3: 500, 4: 800 };
      state.score += scoreTable[newLinesCleared] || 0;

      state.lastLinesCleared = newLinesCleared;

      state.pieceIndex += 1;
      const nextPiece = state.nextPieces[state.pieceIndex];

      if (nextPiece) {
        const newPiece = { ...nextPiece, x: 3, y: 0 };

        if (isGameOver(state.board, newPiece)) {
          state.isPlaying = false;
          state.isGameOver = true;
          state.currentPiece = null;
        } else {
          state.currentPiece = newPiece;
        }
      } else {
        state.currentPiece = null;
      }
    },

    lockCurrentPiece: (state) => {
      if (!state.currentPiece) return;

      state.board = lockPiece(state.board, state.currentPiece);

      const result = clearLines(state.board);
      state.board = result.board;
      const newLinesCleared = result.linesCleared;
      state.linesCleared += newLinesCleared;

      const scoreTable = { 1: 100, 2: 300, 3: 500, 4: 800 };
      state.score += scoreTable[newLinesCleared] || 0;

      state.lastLinesCleared = newLinesCleared;

      state.pieceIndex += 1;
      const nextPiece = state.nextPieces[state.pieceIndex];

      if (nextPiece) {
        const newPiece = { ...nextPiece, x: 3, y: 0 };

        if (isGameOver(state.board, newPiece)) {
          state.isPlaying = false;
          state.isGameOver = true;
          state.currentPiece = null;
        } else {
          state.currentPiece = newPiece;
        }
      } else {
        state.currentPiece = null;
      }
    },

    addPenalty: (state, action) => {
      const { lineCount } = action.payload;
      state.board = addPenaltyLines(state.board, lineCount);

      if (
        state.currentPiece &&
        checkCollision(state.board, state.currentPiece)
      ) {
        let pushed = movePiece(state.currentPiece, 0, -lineCount);
        if (!checkCollision(state.board, pushed)) {
          state.currentPiece = pushed;
        } else {
          state.isPlaying = false;
          state.isGameOver = true;
        }
      }
    },

    updateSpectrum: (state, action) => {
      const { playerId, spectrum } = action.payload;
      state.spectrums[playerId] = spectrum;
    },

    setGameOver: (state, action) => {
      state.isPlaying = false;
      state.isGameOver = true;
      state.winner = action.payload?.winner || null;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    leaveRoom: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  setConnected,
  setRoom,
  setPlayer,
  setGame,
  startGame,
  resetGame,
  setCurrentPiece,
  addNextPiece,
  moveLeft,
  moveRight,
  moveDown,
  rotate,
  hardDropPiece,
  lockCurrentPiece,
  addPenalty,
  updateSpectrum,
  setGameOver,
  setError,
  clearError,
  leaveRoom,
} = gameSlice.actions;

export default gameSlice.reducer;
