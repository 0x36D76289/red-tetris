class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.board = Array(20).fill(null).map(() => Array(10).fill(0));
    this.isAlive = true;
    this.spectrum = Array(10).fill(0);
  }

  updateSpectrum() {
    this.spectrum = this.board.map(column => {
      for (let i = 0; i < column.length; i++) {
        if (column[i] !== 0) {
          return 20 - i;
        }
      }
      return 0;
    });
  }

  die() {
    this.isAlive = false;
  }
}

module.exports = Player;
