const { SHAPES } = require("./Piece");

const FIELD_WIDTH = 10;
const FIELD_HEIGHT = 20;

const createEmptyField = () =>
  Array(FIELD_HEIGHT)
    .fill(null)
    .map(() => Array(FIELD_WIDTH).fill(0));

const isValidPosition = (field, piece, x, y, rotation = null) => {
  const pieceRotation = rotation !== null ? rotation : piece.rotation;
  const shape = SHAPES[piece.type][pieceRotation];

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newY = y + row;
        const newX = x + col;

        if (newX < 0 || newX >= FIELD_WIDTH || newY >= FIELD_HEIGHT) {
          return false;
        }

        if (newY >= 0 && field[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }

  return true;
};

const getPieceColorIndex = (type) => {
  const types = ["I", "O", "T", "S", "Z", "J", "L"];
  return types.indexOf(type) + 1;
};

const mergePieceToField = (field, piece) => {
  const shape = SHAPES[piece.type][piece.rotation];
  const newField = field.map((row) => [...row]);

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const y = piece.y + row;
        const x = piece.x + col;

        if (y >= 0 && y < FIELD_HEIGHT && x >= 0 && x < FIELD_WIDTH) {
          newField[y][x] = getPieceColorIndex(piece.type);
        }
      }
    }
  }

  return newField;
};

const clearLines = (field) => {
  let linesCleared = 0;
  const newField = [];

  for (let row = field.length - 1; row >= 0; row--) {
    const isComplete = field[row].every((cell) => cell !== 0);

    if (!isComplete) {
      newField.unshift(field[row]);
    } else {
      linesCleared++;
    }
  }

  while (newField.length < FIELD_HEIGHT) {
    newField.unshift(Array(FIELD_WIDTH).fill(0));
  }

  return { field: newField, linesCleared };
};

const isGameOver = (field) => field[0].some((cell) => cell !== 0);

const calculateSpectrum = (field) => {
  const spectrum = Array(FIELD_WIDTH).fill(0);

  for (let col = 0; col < FIELD_WIDTH; col++) {
    for (let row = 0; row < FIELD_HEIGHT; row++) {
      if (field[row][col] !== 0) {
        spectrum[col] = FIELD_HEIGHT - row;
        break;
      }
    }
  }

  return spectrum;
};

// Applies a locked piece to the authoritative field, clearing lines and
// returning updated state. This ignores client-sent field data.
const applyPieceLock = (field, piece) => {
  if (!piece || !piece.type) {
    return { valid: false, field, linesCleared: 0, spectrum: calculateSpectrum(field), gameOver: false };
  }

  const isValid = isValidPosition(field, piece, piece.x, piece.y, piece.rotation);
  if (!isValid) {
    return { valid: false, field, linesCleared: 0, spectrum: calculateSpectrum(field), gameOver: false };
  }

  const merged = mergePieceToField(field, piece);
  const { field: clearedField, linesCleared } = clearLines(merged);
  const spectrum = calculateSpectrum(clearedField);

  return {
    valid: true,
    field: clearedField,
    linesCleared,
    spectrum,
    gameOver: isGameOver(clearedField),
  };
};

module.exports = {
  applyPieceLock,
  createEmptyField,
  calculateSpectrum,
};
