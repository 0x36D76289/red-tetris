import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import gameReducer, {
  setConnected,
  setRoom,
  setPlayer,
  setGame,
  startGame,
  resetGame,
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
} from "../../client/store/gameSlice.js";

describe("gameSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { game: gameReducer },
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = store.getState().game;

      expect(state.isConnected).toBe(false);
      expect(state.roomName).toBeNull();
      expect(state.player).toBeNull();
      expect(state.isPlaying).toBe(false);
      expect(state.board).toHaveLength(20);
    });
  });

  describe("setConnected", () => {
    it("should set connected state", () => {
      store.dispatch(setConnected(true));
      expect(store.getState().game.isConnected).toBe(true);
    });
  });

  describe("setRoom", () => {
    it("should set room name", () => {
      store.dispatch(setRoom("testRoom"));
      expect(store.getState().game.roomName).toBe("testRoom");
    });
  });

  describe("setPlayer", () => {
    it("should set player and host status", () => {
      const player = { id: "1", name: "Test", isHost: true };
      store.dispatch(setPlayer(player));

      expect(store.getState().game.player).toEqual(player);
      expect(store.getState().game.isHost).toBe(true);
    });
  });

  describe("setGame", () => {
    it("should set game and update opponents", () => {
      const player = { id: "1", name: "Me" };
      store.dispatch(setPlayer(player));

      const game = {
        players: [
          { id: "1", name: "Me", isHost: true },
          { id: "2", name: "Other" },
        ],
      };
      store.dispatch(setGame(game));

      expect(store.getState().game.game).toEqual(game);
      expect(store.getState().game.opponents).toHaveLength(1);
      expect(store.getState().game.isHost).toBe(true);
    });
  });

  describe("startGame", () => {
    it("should initialize game state", () => {
      const pieces = [
        { type: "I", x: 3, y: 0, rotation: 0 },
        { type: "T", x: 3, y: 0, rotation: 0 },
      ];
      store.dispatch(startGame({ pieces }));

      const state = store.getState().game;
      expect(state.isPlaying).toBe(true);
      expect(state.isGameOver).toBe(false);
      expect(state.currentPiece.type).toBe("I");
      expect(state.nextPieces).toHaveLength(2);
    });
  });

  describe("resetGame", () => {
    it("should reset game state", () => {
      store.dispatch(startGame({ pieces: [{ type: "I" }] }));
      store.dispatch(resetGame());

      const state = store.getState().game;
      expect(state.isPlaying).toBe(false);
      expect(state.currentPiece).toBeNull();
      expect(state.score).toBe(0);
    });
  });

  describe("piece movements", () => {
    beforeEach(() => {
      const pieces = [{ type: "T", x: 5, y: 5, rotation: 0 }];
      store.dispatch(startGame({ pieces }));
    });

    it("moveLeft should move piece left", () => {
      const initialX = store.getState().game.currentPiece.x;
      store.dispatch(moveLeft());
      expect(store.getState().game.currentPiece.x).toBe(initialX - 1);
    });

    it("moveRight should move piece right", () => {
      const initialX = store.getState().game.currentPiece.x;
      store.dispatch(moveRight());
      expect(store.getState().game.currentPiece.x).toBe(initialX + 1);
    });

    it("moveDown should move piece down", () => {
      const initialY = store.getState().game.currentPiece.y;
      store.dispatch(moveDown());
      expect(store.getState().game.currentPiece.y).toBe(initialY + 1);
    });

    it("rotate should rotate piece", () => {
      store.dispatch(rotate());
      expect(store.getState().game.currentPiece.rotation).toBe(1);
    });

    it("should not move when not playing", () => {
      store.dispatch(resetGame());
      store.dispatch(moveLeft());
    });
  });

  describe("hardDropPiece", () => {
    it("should drop piece to bottom, lock it, and spawn next piece", () => {
      const pieces = [
        { type: "I", x: 3, y: 0, rotation: 0 },
        { type: "T", x: 3, y: 0, rotation: 0 },
      ];
      store.dispatch(startGame({ pieces }));
      store.dispatch(hardDropPiece());

      const state = store.getState().game;
      expect(state.currentPiece.type).toBe("T");
      expect(state.pieceIndex).toBe(1);
      expect(state.board[19].some((cell) => cell !== 0)).toBe(true);
    });
  });

  describe("addPenalty", () => {
    it("should add penalty lines", () => {
      const pieces = [{ type: "I", x: 3, y: 5, rotation: 0 }];
      store.dispatch(startGame({ pieces }));
      store.dispatch(addPenalty({ lineCount: 2 }));

      const state = store.getState().game;
      expect(state.board[18].every((cell) => cell === -1)).toBe(true);
      expect(state.board[19].every((cell) => cell === -1)).toBe(true);
    });
  });

  describe("updateSpectrum", () => {
    it("should update spectrum for player", () => {
      const spectrum = Array(10).fill(15);
      store.dispatch(updateSpectrum({ playerId: "player1", spectrum }));

      expect(store.getState().game.spectrums.player1).toEqual(spectrum);
    });
  });

  describe("setGameOver", () => {
    it("should set game over state", () => {
      store.dispatch(setGameOver({ winner: { id: "1", name: "Winner" } }));

      const state = store.getState().game;
      expect(state.isPlaying).toBe(false);
      expect(state.isGameOver).toBe(true);
      expect(state.winner.name).toBe("Winner");
    });
  });

  describe("error handling", () => {
    it("setError should set error", () => {
      store.dispatch(setError("Test error"));
      expect(store.getState().game.error).toBe("Test error");
    });

    it("clearError should clear error", () => {
      store.dispatch(setError("Test error"));
      store.dispatch(clearError());
      expect(store.getState().game.error).toBeNull();
    });
  });

  describe("leaveRoom", () => {
    it("should reset to initial state", () => {
      store.dispatch(setRoom("test"));
      store.dispatch(setPlayer({ id: "1" }));
      store.dispatch(leaveRoom());

      const state = store.getState().game;
      expect(state.roomName).toBeNull();
      expect(state.player).toBeNull();
    });
  });
});
