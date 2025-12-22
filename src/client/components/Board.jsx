import React from "react";
import {
  CELL_SIZE,
  getPieceShape,
  getPieceColor,
  getGhostPiece,
} from "../game/tetris.js";
import "./Board.css";

const Cell = ({ color, isPenalty }) => {
  const style = {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: isPenalty ? "#444" : color || "transparent",
    border: color
      ? "1px solid rgba(255,255,255,0.2)"
      : "1px solid rgba(255,255,255,0.05)",
    boxShadow:
      color && !isPenalty ? "inset 0 0 10px rgba(255,255,255,0.3)" : "none",
  };

  return <div className="cell" style={style} />;
};

const Board = ({ board, currentPiece, showGhost = true }) => {
  const displayBoard = board.map((row) => [...row]);

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  if (currentPiece && showGhost) {
    const ghost = getGhostPiece(board, currentPiece);
    const ghostShape = getPieceShape(ghost);
    const ghostColor = getPieceColor(ghost.type);

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (ghostShape[row][col]) {
          const boardY = ghost.y + row;
          const boardX = ghost.x + col;
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            if (displayBoard[boardY][boardX] === 0) {
              displayBoard[boardY][boardX] = hexToRgba(ghostColor, 0.25);
            }
          }
        }
      }
    }
  }

  if (currentPiece) {
    const shape = getPieceShape(currentPiece);
    const color = getPieceColor(currentPiece.type);

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (shape[row][col]) {
          const boardY = currentPiece.y + row;
          const boardX = currentPiece.x + col;
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            displayBoard[boardY][boardX] = color;
          }
        }
      }
    }
  }

  return (
    <div className="board">
      {displayBoard.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              color={cell === -1 ? "#666" : cell}
              isPenalty={cell === -1}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export { Board };
