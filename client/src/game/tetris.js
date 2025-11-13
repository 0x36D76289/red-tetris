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
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        // spawn at the top
        const centeredCol = Math.floor(grid[0].length / 2) - 1 + c;
        gridCopy[r][centeredCol] = `moving-${letter}`;
      }
    }
  }
  return gridCopy;
}

export function moveTetriminoDown(grid) {
  const newGrid = _.cloneDeep(grid);
  const movingPositions = [];
  
  // Find all moving tetrimino positions
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (typeof grid[r][c] === 'string' && grid[r][c].startsWith('moving-')) {
        movingPositions.push([r, c, grid[r][c]]);
      }
    }
  }
  
  // Check if can move down
  for (const [r, c] of movingPositions) {
    if (r === grid.length - 1 || (grid[r + 1][c] !== 0 && !grid[r + 1][c].startsWith('moving-'))) {
      return grid; // cannot move down
    }
  }
  
  // Clear old positions
  for (const [r, c] of movingPositions) {
    newGrid[r][c] = 0;
  }
  
  // Set new positions
  for (const [r, c, value] of movingPositions) {
    newGrid[r + 1][c] = value;
  }

  return newGrid;
}

export function isTetriminoCurrentlyFalling(grid) {
  const movingPositions = [];
  
  // Find all moving tetrimino positions
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (typeof grid[r][c] === 'string' && grid[r][c].startsWith('moving-')) {
        movingPositions.push([r, c]);
      }
    }
  }
  
  if (movingPositions.length === 0) return false;
  
  for (const [r, c] of movingPositions) {
    if (r === grid.length - 1 || (grid[r + 1][c] !== 0 && !grid[r + 1][c].startsWith('moving-'))) {
      return false;
    }
  }
  return true;
}

export function fixTetrimino(grid) {
  const newGrid = _.cloneDeep(grid);
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (typeof grid[r][c] === 'string' && grid[r][c].startsWith('moving-')) {
        newGrid[r][c] = grid[r][c].replace('moving-', '');
      }
    }
  }
  return newGrid;
}

export function processGameTick(grid) {
  if (isTetriminoCurrentlyFalling(grid)) {
    return moveTetriminoDown(grid);
  } else {
    // Fix the current tetrimino in place
    let newGrid = fixTetrimino(grid);
    console.log("Spawning new tetrimino");
    const randomTetrimino = generateRandomTetrimino();
    return spawnTetrimino(newGrid, randomTetrimino.letter);
  }
}


export function findMovingTetriminoPositions(grid) {
  const movingPositions = [];
  
  // Find all moving tetrimino positions
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (typeof grid[r][c] === 'string' && grid[r][c].startsWith('moving-')) {
        movingPositions.push([r, c]);
      }
    }
  }
  
  return movingPositions;
}

export function clearPositions(grid, positions) {
  const newGrid = _.cloneDeep(grid);
  for (const [r, c] of positions) {
    newGrid[r][c] = 0;
  }
  return newGrid;
}

export function setPositions(grid, positions, value) {
  const newGrid = _.cloneDeep(grid);
  for (const [r, c] of positions) {
    newGrid[r][c] = value;
  }
  return newGrid;
}

export function moveTetriminoLeft(grid) {
  const movingPositions = findMovingTetriminoPositions(grid);
  console.log("Moving Positions:", movingPositions);
  
  // Check if can move left
  for (const [r, c] of movingPositions) {
    if (c === 0 || (grid[r][c - 1] !== 0 && !grid[r][c - 1].startsWith('moving-'))) {
      return grid; // cannot move left
    }
  }
    console.log("AVANT clear:", grid[movingPositions[0][0]][movingPositions[0][1]]); // moving-X

  let newGrid = clearPositions(grid, movingPositions);
    console.log("APRES clear:", grid[movingPositions[0][0]][movingPositions[0][1]]); // 0 !!!
  // Set new positions
  const newPositions = movingPositions.map(([r, c]) => [r, c - 1]);
  console.log("New Positions:", newPositions);
  newGrid = setPositions(newGrid, newPositions, grid[movingPositions[0][0]][movingPositions[0][1]]);
  
  return newGrid;
}

export function moveTetriminoRight(grid) {
  const movingPositions = findMovingTetriminoPositions(grid);
  
  // Check if can move right
  for (const [r, c] of movingPositions) {
    if (c === grid[0].length - 1 || (grid[r][c + 1] !== 0 && !grid[r][c + 1].startsWith('moving-'))) {
      return grid; // cannot move right
    }
  }
  
  let newGrid = clearPositions(grid, movingPositions);
  
  // Set new positions
  const newPositions = movingPositions.map(([r, c]) => [r, c + 1]);
  newGrid = setPositions(newGrid, newPositions, grid[movingPositions[0][0]][movingPositions[0][1]]);
  
  return newGrid;
}

export function rotateTetrimino(grid) {
  const movingPositions = findMovingTetriminoPositions(grid);
  if (movingPositions.length === 0) return grid;

  // Determine bounding box
  let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
  for (const [r, c] of movingPositions) {
    if (r < minR) minR = r;
    if (r > maxR) maxR = r;
    if (c < minC) minC = c;
    if (c > maxC) maxC = c;
  }

  const size = Math.max(maxR - minR + 1, maxC - minC + 1);
  const shape = Array.from({ length: size }, () => Array(size).fill(0));

  // Fill shape matrix
  for (const [r, c] of movingPositions) {
    shape[r - minR][c - minC] = 1;
  }

  // Rotate shape matrix
  const rotatedShape = Array.from({ length: size }, () => Array(size).fill(0));
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      rotatedShape[c][size - 1 - r] = shape[r][c];
    }
  }

  // Check if can place rotated shape
  const newPositions = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (rotatedShape[r][c]) {
        const gridR = minR + r;
        const gridC = minC + c;
        if (gridR < 0 || gridR >= grid.length || gridC < 0 || gridC >= grid[0].length ||
            (grid[gridR][gridC] !== 0 && !grid[gridR][gridC].startsWith('moving-'))) {
          return grid; // cannot rotate
        }
        newPositions.push([gridR, gridC]);
      }
    }
  }

  let newGrid = clearPositions(grid, movingPositions);
  newGrid = setPositions(newGrid, newPositions, grid[movingPositions[0][0]][movingPositions[0][1]]);

  return newGrid;
}