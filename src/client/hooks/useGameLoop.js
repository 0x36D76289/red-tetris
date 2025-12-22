import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  moveLeft,
  moveRight,
  moveDown,
  rotate,
  hardDropPiece,
  lockCurrentPiece,
  addNextPiece,
  addPenalty,
  updateSpectrum,
  setGame,
  setGameOver,
  startGame as startGameAction,
  resetGame,
} from "../store/gameSlice.js";
import {
  requestNextPiece,
  updateBoard,
  notifyLinesCleared,
  notifyEliminated,
  onGameUpdate,
  onGameStarted,
  onGameRestarted,
  onSpectrumUpdate,
  onPenaltyAdd,
  onPlayerEliminated,
  onGameOver,
} from "../socket/socketService.js";
import { checkCollision, movePiece } from "../game/tetris.js";

const GAME_SPEED = 1000; // 1 second
const LOCK_DELAY = 500; // 500ms

const useGameLoop = (roomName) => {
  const dispatch = useDispatch();
  const gameLoopRef = useRef(null);
  const lockTimeoutRef = useRef(null);
  const lastDropRef = useRef(Date.now());

  const {
    isPlaying,
    isGameOver,
    board,
    currentPiece,
    nextPieces,
    pieceIndex,
    player,
  } = useSelector((state) => state.game);

  const fetchNextPieces = useCallback(async () => {
    if (!roomName) return;

    const neededIndex = pieceIndex + 3;
    if (neededIndex >= nextPieces.length) {
      for (let i = nextPieces.length; i <= neededIndex; i++) {
        try {
          const result = await requestNextPiece(roomName, i);
          if (result.piece) {
            dispatch(addNextPiece(result.piece));
          }
        } catch (error) {
          console.error("Failed to fetch piece:", error);
        }
      }
    }
  }, [roomName, pieceIndex, nextPieces.length, dispatch]);

  const handleLock = useCallback(() => {
    if (!currentPiece || !isPlaying) return;

    dispatch(lockCurrentPiece());

    setTimeout(() => {
      const state = window.__REDUX_STORE__?.getState?.()?.game;
      if (state) {
        updateBoard(roomName, state.board);

        if (state.lastLinesCleared > 0) {
          notifyLinesCleared(roomName, state.lastLinesCleared);
        }
      }
    }, 0);

    fetchNextPieces();
  }, [currentPiece, isPlaying, roomName, dispatch, fetchNextPieces]);

  useEffect(() => {
    if (!isPlaying || isGameOver || !currentPiece) return;

    const gameLoop = () => {
      const now = Date.now();

      if (now - lastDropRef.current >= GAME_SPEED) {
        lastDropRef.current = now;

        const canMoveDown = !checkCollision(
          board,
          movePiece(currentPiece, 0, 1)
        );

        if (canMoveDown) {
          dispatch(moveDown());
          if (lockTimeoutRef.current) {
            clearTimeout(lockTimeoutRef.current);
            lockTimeoutRef.current = null;
          }
        } else {
          if (!lockTimeoutRef.current) {
            lockTimeoutRef.current = setTimeout(() => {
              handleLock();
              lockTimeoutRef.current = null;
            }, LOCK_DELAY);
          }
        }
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
    };
  }, [isPlaying, isGameOver, currentPiece, board, dispatch, handleLock]);

  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e) => {
      if (!isPlaying || isGameOver) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          dispatch(moveLeft());
          break;
        case "ArrowRight":
          e.preventDefault();
          dispatch(moveRight());
          break;
        case "ArrowDown":
          e.preventDefault();
          dispatch(moveDown());
          break;
        case "ArrowUp":
          e.preventDefault();
          dispatch(rotate());
          break;
        case " ":
          e.preventDefault();
          dispatch(hardDropPiece());
          setTimeout(() => {
            const state = window.__REDUX_STORE__?.getState?.()?.game;
            if (state) {
              updateBoard(roomName, state.board);
              if (state.lastLinesCleared > 0) {
                notifyLinesCleared(roomName, state.lastLinesCleared);
              }
            }
          }, 0);
          fetchNextPieces();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isGameOver, dispatch, handleLock]);

  useEffect(() => {
    if (!roomName) return;

    const unsubscribers = [
      onGameUpdate((game) => {
        dispatch(setGame(game));
      }),

      onGameStarted(({ game, pieces }) => {
        dispatch(startGameAction({ pieces }));
        dispatch(setGame(game));
        lastDropRef.current = Date.now();
      }),

      onGameRestarted((game) => {
        dispatch(resetGame());
        dispatch(setGame(game));
      }),

      onSpectrumUpdate((data) => {
        dispatch(updateSpectrum(data));
      }),

      onPenaltyAdd(({ fromPlayerId, lineCount }) => {
        if (fromPlayerId !== player?.id) {
          dispatch(addPenalty({ lineCount }));
        }
      }),

      onPlayerEliminated(({ playerId }) => {}),

      onGameOver(({ winner }) => {
        dispatch(setGameOver({ winner }));
      }),
    ];

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [roomName, player?.id, dispatch]);

  useEffect(() => {
    if (isGameOver && isPlaying === false && roomName && player) {
      notifyEliminated(roomName);
    }
  }, [isGameOver, isPlaying, roomName, player]);

  useEffect(() => {
    if (isPlaying && roomName && board) {
      updateBoard(roomName, board);
    }
  }, [board, isPlaying, roomName]);

  return {
    fetchNextPieces,
  };
};

export { useGameLoop };
