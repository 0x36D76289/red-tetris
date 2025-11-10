import _ from "lodash"

export const tetriminos = {
  I : [
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
     
  ],
  O: [
    [1,1],
    [1,1]
  ],
  T: [
    [0,0,0],
    [1,1,1],
    [0,1,0],
  ],
  L: [
    [0,0,0],
    [1,1,1],
    [1,0,0]
  ],
  J: [
    [0,0,0],
    [1,1,1],
    [0,0,1]
  ],
  Z: [
    [1,1,0],
    [0,1,1],
    [0,0,0]
  ],
  S: [
    [0,1,1],
    [1,1,0],
    [0,0,0]
  ]

}


const colors = {
  I: 'cyan',
  O: 'yellow',
  T: 'purple',
  L: 'orange',
  J: 'blue',
  Z: 'red',
  S: 'green'
}

export function createGrid(width, height) {
  return Array.from({ length: height }, () => Array(width).fill(0));
};

export function generateRandomTetrimino() {
  // send a object like { shape: [[...]], color: 'red', letter: 'I' }
  return _.sample(Object.entries(tetriminos).map(([letter, shape]) => ({ shape, letter, color: colors[letter] })));

}

export function spawnTetrimino(grid, letter) {
  const shape = tetriminos[letter];
  const gridCopy = _.cloneDeep(grid);
  let tetriminoPositions = [];
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        // spawn at the top
        const centeredCol = Math.floor(grid[0].length / 2) - 1 + c;
        gridCopy[r][centeredCol] = letter;
        tetriminoPositions.push([r, centeredCol]);
      }
    }
  }
  return {grid: gridCopy, tetriminoPositions};
}

export function moveTetriminoDown(grid, tetriminoPositions) {
  const newGrid = _.cloneDeep(grid);
  for (const [r, c] of tetriminoPositions) {
    if (r === grid.length - 1 || grid[r + 1][c] !== 0) {
      return grid; // cannot move down
    }
  }
  for (const [r, c] of tetriminoPositions) {
    newGrid[r + 1][c] = grid[r][c];
    newGrid[r][c] = 0;
  }

  return { grid: newGrid, tetriminoPositions: tetriminoPositions.map(([r, c]) => [r + 1, c]) };
}

export function isTetriminoCurrentlyFalling(grid, tetriminoPositions) {
  if (tetriminoPositions.length === 0) return false;
  for (const [r, c] of tetriminoPositions) {
    if (r === grid.length - 1 || grid[r + 1][c] !== 0) {
      return false;
    }
  }
  return true;
}

export function processGameTick(grid, tetriminoPositions) {
  let returnValue;
  if (isTetriminoCurrentlyFalling(grid, tetriminoPositions)) {
    returnValue = moveTetriminoDown(grid, tetriminoPositions);
  } else {
    console.log("Spawning new tetrimino");
    const randomTetrimino = generateRandomTetrimino();
    returnValue = spawnTetrimino(grid, randomTetrimino.letter);
  }
  return { grid: returnValue.grid, tetriminoPositions: returnValue.tetriminoPositions };
}