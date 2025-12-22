import { v4 as uuidv4 } from "uuid";

class Player {
  constructor(name, socketId) {
    this.id = uuidv4();
    this.name = name;
    this.socketId = socketId;
    this.isHost = false;
    this.isPlaying = false;
    this.isEliminated = false;
    this.board = this.createEmptyBoard();
    this.currentPieceIndex = 0;
    this.score = 0;
    this.linesCleared = 0;
  }

  createEmptyBoard() {
    return Array(20)
      .fill(null)
      .map(() => Array(10).fill(0));
  }

  reset() {
    this.board = this.createEmptyBoard();
    this.currentPieceIndex = 0;
    this.isPlaying = false;
    this.isEliminated = false;
    this.score = 0;
    this.linesCleared = 0;
    return this;
  }

  setHost(isHost) {
    this.isHost = isHost;
    return this;
  }

  startPlaying() {
    this.isPlaying = true;
    this.isEliminated = false;
    return this;
  }

  eliminate() {
    this.isPlaying = false;
    this.isEliminated = true;
    return this;
  }

  updateBoard(board) {
    this.board = board;
    return this;
  }

  incrementPieceIndex() {
    this.currentPieceIndex += 1;
    return this;
  }

  addScore(lines) {
    const scoreTable = { 1: 100, 2: 300, 3: 500, 4: 800 };
    this.score += scoreTable[lines] || 0;
    this.linesCleared += lines;
    return this;
  }

  addPenaltyLines(count) {
    for (let i = 0; i < count; i++) {
      this.board.shift();
      const penaltyLine = Array(10).fill(-1);
      this.board.push(penaltyLine);
    }
    return this;
  }

  getSpectrum() {
    const spectrum = Array(10).fill(20);
    for (let col = 0; col < 10; col++) {
      for (let row = 0; row < 20; row++) {
        if (this.board[row][col] !== 0) {
          spectrum[col] = row;
          break;
        }
      }
    }
    return spectrum;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      isHost: this.isHost,
      isPlaying: this.isPlaying,
      isEliminated: this.isEliminated,
      score: this.score,
      linesCleared: this.linesCleared,
      spectrum: this.getSpectrum(),
    };
  }

  toFullJSON() {
    return {
      ...this.toJSON(),
      board: this.board,
      currentPieceIndex: this.currentPieceIndex,
    };
  }
}

export { Player };
