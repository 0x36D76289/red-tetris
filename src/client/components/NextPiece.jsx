import React from "react";
import { SHAPES, getPieceShape } from "../game/tetris.js";
import "./NextPiece.css";

const NextPiece = ({ piece }) => {
  if (!piece) {
    return (
      <div className="next-piece-container">
        <h3>Next</h3>
        <div className="next-piece-grid empty" />
      </div>
    );
  }

  const shape = getPieceShape(piece);
  const color = SHAPES[piece.type].color;

  return (
    <div className="next-piece-container">
      <h3>Next</h3>
      <div className="next-piece-grid">
        {shape.map((row, rowIndex) => (
          <div key={rowIndex} className="next-piece-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="next-piece-cell"
                style={{
                  backgroundColor: cell ? color : "transparent",
                  border: cell
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid transparent",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export { NextPiece };
