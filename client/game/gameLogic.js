import { TETROMINOS } from "./constants";

export const createField = () =>
  Array(20)
    .fill(null)
    .map(() => Array(10).fill(0));

export const isValidPosition = (field, piece, x, y, rotation = null) => {
  const pieceRotation = rotation !== null ? rotation : piece.rotation;
  const shape = TETROMINOS[piece.type][pieceRotation];

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newY = y + row;
        const newX = x + col;

        if (newX < 0 || newX >= 10 || newY >= 20) {
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

export const movePieceLeft = (field, piece) => {
  const newX = piece.x - 1;

  if (isValidPosition(field, piece, newX, piece.y, piece.rotation)) {
    return { ...piece, x: newX };
  }

  return piece;
};

export const movePieceRight = (field, piece) => {
  const newX = piece.x + 1;

  if (isValidPosition(field, piece, newX, piece.y, piece.rotation)) {
    return { ...piece, x: newX };
  }

  return piece;
};

export const movePieceDown = (field, piece) => {
  const newY = piece.y + 1;

  if (isValidPosition(field, piece, piece.x, newY, piece.rotation)) {
    return { piece: { ...piece, y: newY }, locked: false };
  }

  return { piece, locked: true };
};

export const rotatePiece = (field, piece) => {
  const newRotation = (piece.rotation + 1) % 4;

  if (isValidPosition(field, piece, piece.x, piece.y, newRotation)) {
    return { ...piece, rotation: newRotation };
  }

  const kicks = [-1, 1, -2, 2];

  for (const kick of kicks) {
    if (isValidPosition(field, piece, piece.x + kick, piece.y, newRotation)) {
      return { ...piece, x: piece.x + kick, rotation: newRotation };
    }
  }

  return piece;
};

export const hardDrop = (field, piece) => {
  let newPiece = { ...piece };

  while (
    isValidPosition(
      field,
      newPiece,
      newPiece.x,
      newPiece.y + 1,
      newPiece.rotation
    )
  ) {
    newPiece = { ...newPiece, y: newPiece.y + 1 };
  }

  return newPiece;
};

export const mergePieceToField = (field, piece) => {
  const newField = field.map((row) => [...row]);
  const shape = TETROMINOS[piece.type][piece.rotation];

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const y = piece.y + row;
        const x = piece.x + col;

        if (y >= 0 && y < 20 && x >= 0 && x < 10) {
          newField[y][x] = getPieceColorIndex(piece.type);
        }
      }
    }
  }

  return newField;
};

const getPieceColorIndex = (type) => {
  const types = ["I", "O", "T", "S", "Z", "J", "L"];
  return types.indexOf(type) + 1;
};

export const clearLines = (field) => {
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

  while (newField.length < 20) {
    newField.unshift(Array(10).fill(0));
  }

  return { field: newField, linesCleared };
};

export const isGameOver = (field) => {
  return field[0].some((cell) => cell !== 0);
};

export const getGhostPiece = (field, piece) => {
  return hardDrop(field, piece);
};

export const calculateSpectrum = (field) => {
  const spectrum = Array(10).fill(0);

  for (let col = 0; col < 10; col++) {
    for (let row = 0; row < 20; row++) {
      if (field[row][col] !== 0) {
        spectrum[col] = 20 - row;
        break;
      }
    }
  }

  return spectrum;
};

export const createPiece = (type) => ({
  type,
  x: 3,
  y: 0,
  rotation: 0,
});
