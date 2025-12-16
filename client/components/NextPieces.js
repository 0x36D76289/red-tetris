import React from "react";
import { TETROMINOS, COLORS } from "../game/constants";

const NextPieces = ({ pieces }) => {
  const renderPiece = (pieceType) => {
    const shape = TETROMINOS[pieceType][0];
    const types = ["I", "O", "T", "S", "Z", "J", "L"];
    const colorIndex = types.indexOf(pieceType) + 1;

    return (
      <div className="next-piece">
        {shape.map((row, rowIndex) => (
          <div key={rowIndex} className="next-piece-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="next-piece-cell"
                style={{
                  backgroundColor: cell ? COLORS[colorIndex] : "transparent",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="next-pieces">
      <h3>Next</h3>
      <div className="next-pieces-container">
        {pieces.map((piece, index) => (
          <div key={index}>{renderPiece(piece)}</div>
        ))}
      </div>
    </div>
  );
};

export default NextPieces;
