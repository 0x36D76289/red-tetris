const SHAPES = {
  I: {
    color: "#00f0f0",
    rotations: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
    ],
  },
  O: {
    color: "#f0f000",
    rotations: [
      [
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
  },
  T: {
    color: "#a000f0",
    rotations: [
      [
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
  },
  S: {
    color: "#00f000",
    rotations: [
      [
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
  },
  Z: {
    color: "#f00000",
    rotations: [
      [
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
  },
  J: {
    color: "#0000f0",
    rotations: [
      [
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
  },
  L: {
    color: "#f0a000",
    rotations: [
      [
        [0, 0, 1, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
  },
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;

const createEmptyBoard = () =>
  Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(0));

const getPieceShape = (piece) => SHAPES[piece.type].rotations[piece.rotation];

const getPieceColor = (type) => SHAPES[type].color;

const checkCollision = (board, piece, offsetX = 0, offsetY = 0) => {
  const shape = getPieceShape(piece);
  const newX = piece.x + offsetX;
  const newY = piece.y + offsetY;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (shape[row][col]) {
        const boardX = newX + col;
        const boardY = newY + row;

        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return true;
        }

        if (boardY >= 0 && board[boardY][boardX] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
};

const rotatePiece = (piece, direction = 1) => ({
  ...piece,
  rotation: (piece.rotation + direction + 4) % 4,
});

const movePiece = (piece, dx, dy) => ({
  ...piece,
  x: piece.x + dx,
  y: piece.y + dy,
});

const lockPiece = (board, piece) => {
  const newBoard = board.map((row) => [...row]);
  const shape = getPieceShape(piece);
  const color = getPieceColor(piece.type);

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (shape[row][col]) {
        const boardY = piece.y + row;
        const boardX = piece.x + col;
        if (
          boardY >= 0 &&
          boardY < BOARD_HEIGHT &&
          boardX >= 0 &&
          boardX < BOARD_WIDTH
        ) {
          newBoard[boardY][boardX] = color;
        }
      }
    }
  }
  return newBoard;
};

const clearLines = (board) => {
  const newBoard = board.filter((row) =>
    row.some((cell) => cell === 0 || cell === -1)
  );
  const clearedCount = BOARD_HEIGHT - newBoard.length;

  const emptyRows = Array(clearedCount)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(0));

  return {
    board: [...emptyRows, ...newBoard],
    linesCleared: clearedCount,
  };
};

const addPenaltyLines = (board, count) => {
  const newBoard = [...board];
  for (let i = 0; i < count; i++) {
    newBoard.shift();
    newBoard.push(Array(BOARD_WIDTH).fill(-1));
  }
  return newBoard;
};

const calculateSpectrum = (board) => {
  const spectrum = Array(BOARD_WIDTH).fill(BOARD_HEIGHT);
  for (let col = 0; col < BOARD_WIDTH; col++) {
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      if (board[row][col] !== 0) {
        spectrum[col] = row;
        break;
      }
    }
  }
  return spectrum;
};

const isGameOver = (board, piece) => {
  return checkCollision(board, piece);
};

const hardDrop = (board, piece) => {
  let droppedPiece = { ...piece };
  while (!checkCollision(board, droppedPiece, 0, 1)) {
    droppedPiece = movePiece(droppedPiece, 0, 1);
  }
  return droppedPiece;
};

const getGhostPiece = (board, piece) => {
  return hardDrop(board, piece);
};

const getWallKicks = (piece, direction) => {
  const kicks = [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
  ];
  return kicks;
};

const tryRotation = (board, piece, direction = 1) => {
  const rotated = rotatePiece(piece, direction);
  const kicks = getWallKicks(piece, direction);

  for (const kick of kicks) {
    const kicked = movePiece(rotated, kick.x, kick.y);
    if (!checkCollision(board, kicked)) {
      return kicked;
    }
  }
  return piece;
};

export {
  SHAPES,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  CELL_SIZE,
  createEmptyBoard,
  getPieceShape,
  getPieceColor,
  checkCollision,
  rotatePiece,
  movePiece,
  lockPiece,
  clearLines,
  addPenaltyLines,
  calculateSpectrum,
  isGameOver,
  hardDrop,
  getGhostPiece,
  tryRotation,
};
