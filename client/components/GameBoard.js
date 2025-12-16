import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  lineCleared,
  gameOver,
  requestNextPiece,
  usePiece,
} from "../redux/actions/socketActions";
import {
  createField,
  movePieceLeft,
  movePieceRight,
  movePieceDown,
  rotatePiece,
  hardDrop,
  mergePieceToField,
  clearLines,
  isGameOver,
  getGhostPiece,
  createPiece,
} from "../game/gameLogic";
import { GAME_CONFIG } from "../game/constants";
import Field from "./Field";
import NextPieces from "./NextPieces";

const GameBoard = () => {
  const dispatch = useDispatch();
  const {
    nextPieces,
    gameOver: isGameOverState,
    isFinished,
  } = useSelector((state) => state.game);

  const [field, setField] = useState(createField());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [isFastDrop, setIsFastDrop] = useState(false);
  const [lockDelay, setLockDelay] = useState(null);

  const gameLoopRef = useRef(null);
  const lockDelayRef = useRef(null);

  // Initialize first piece
  useEffect(() => {
    if (
      nextPieces.length > 0 &&
      !currentPiece &&
      !isGameOverState &&
      !isFinished
    ) {
      const piece = createPiece(nextPieces[0]);
      setCurrentPiece(piece);
    }
  }, [nextPieces, currentPiece, isGameOverState, isFinished]);

  // Lock piece after delay
  useEffect(() => {
    if (lockDelay !== null) {
      lockDelayRef.current = setTimeout(() => {
        lockPiece();
      }, GAME_CONFIG.LOCK_DELAY);
    }

    return () => {
      if (lockDelayRef.current) {
        clearTimeout(lockDelayRef.current);
      }
    };
  }, [lockDelay]);

  // Game loop - piece falling
  useEffect(() => {
    if (!currentPiece || isGameOverState || isFinished) return;

    const speed = isFastDrop
      ? GAME_CONFIG.FAST_DROP_SPEED
      : GAME_CONFIG.INITIAL_DROP_SPEED;

    gameLoopRef.current = setInterval(() => {
      const result = movePieceDown(field, currentPiece);

      if (result.locked) {
        setLockDelay(Date.now());
      } else {
        setCurrentPiece(result.piece);
        setLockDelay(null);
      }
    }, speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [currentPiece, field, isFastDrop, isGameOverState, isFinished]);

  const lockPiece = useCallback(() => {
    if (!currentPiece) return;

    // Merge piece to field
    const newField = mergePieceToField(field, currentPiece);

    // Check for completed lines
    const { field: clearedField, linesCleared: count } = clearLines(newField);

    setField(clearedField);

    if (count > 0) {
      dispatch(lineCleared(count, clearedField));
    }

    // Check game over
    if (isGameOver(clearedField)) {
      dispatch(gameOver());
      setCurrentPiece(null);
      return;
    }

    // Remove used piece from queue and get next piece
    dispatch(usePiece());

    // Get next piece (which is now at index 0 after shift)
    if (nextPieces.length > 1) {
      const nextPiece = createPiece(nextPieces[1]);
      setCurrentPiece(nextPiece);
      // Request new piece from server (will be added to end of queue)
      dispatch(requestNextPiece());
    }

    setLockDelay(null);
  }, [currentPiece, field, nextPieces, dispatch]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!currentPiece || isGameOverState || isFinished) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          setCurrentPiece(movePieceLeft(field, currentPiece));
          break;
        case "ArrowRight":
          e.preventDefault();
          setCurrentPiece(movePieceRight(field, currentPiece));
          break;
        case "ArrowUp":
          e.preventDefault();
          setCurrentPiece(rotatePiece(field, currentPiece));
          break;
        case "ArrowDown":
          e.preventDefault();
          setIsFastDrop(true);
          break;
        case " ":
          e.preventDefault();
          const droppedPiece = hardDrop(field, currentPiece);
          setCurrentPiece(droppedPiece);
          setLockDelay(Date.now());
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowDown") {
        setIsFastDrop(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentPiece, field, isGameOverState, isFinished]);

  const ghostPiece = currentPiece ? getGhostPiece(field, currentPiece) : null;

  return (
    <div className="game-board">
      <Field
        field={field}
        currentPiece={currentPiece}
        ghostPiece={ghostPiece}
      />
      <NextPieces pieces={nextPieces.slice(1, 4)} />
    </div>
  );
};

export default GameBoard;
