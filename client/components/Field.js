import React from "react";
import { TETROMINOS, COLORS } from "../game/constants";

const Field = ({ field, currentPiece, ghostPiece }) => {
  const renderField = () => {
    const displayField = field.map((row) => [...row]);

    if (ghostPiece && currentPiece) {
      const ghostShape = TETROMINOS[ghostPiece.type][ghostPiece.rotation];

      for (let row = 0; row < ghostShape.length; row++) {
        for (let col = 0; col < ghostShape[row].length; col++) {
          if (ghostShape[row][col]) {
            const y = ghostPiece.y + row;
            const x = ghostPiece.x + col;

            if (
              y >= 0 &&
              y < 20 &&
              x >= 0 &&
              x < 10 &&
              displayField[y][x] === 0
            ) {
              displayField[y][x] = "ghost";
            }
          }
        }
      }
    }

    if (currentPiece) {
      const shape = TETROMINOS[currentPiece.type][currentPiece.rotation];

      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const y = currentPiece.y + row;
            const x = currentPiece.x + col;

            if (y >= 0 && y < 20 && x >= 0 && x < 10) {
              const types = ["I", "O", "T", "S", "Z", "J", "L"];
              displayField[y][x] = types.indexOf(currentPiece.type) + 1;
            }
          }
        }
      }
    }

    return displayField;
  };

  const displayField = renderField();

  return (
    <div className="field">
      {displayField.map((row, rowIndex) => (
        <div key={rowIndex} className="field-row">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${cell === "ghost" ? "ghost-cell" : ""} ${
                cell === -1 ? "penalty-cell" : ""
              }`}
              style={{
                backgroundColor:
                  cell === "ghost" ? "transparent" : COLORS[cell] || COLORS[0],
                border:
                  cell === "ghost"
                    ? `2px solid ${
                        COLORS[
                          displayField
                            .find((_, i) => i === rowIndex)
                            ?.find((c, i) => i === colIndex && c !== "ghost") ||
                            1
                        ]
                      }`
                    : "none",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Field;
