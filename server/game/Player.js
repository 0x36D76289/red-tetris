function Player(socketId, name, isHost = false) {
  this.socketId = socketId;
  this.name = name;
  this.isHost = isHost;
  this.isAlive = true;
  this.field = this.initializeField();
  this.currentPiece = null;
  this.nextPieces = [];
  this.spectrum = new Array(10).fill(0);
}

Player.prototype.initializeField = function () {
  return Array(20)
    .fill(null)
    .map(() => Array(10).fill(0));
};

Player.prototype.updateSpectrum = function () {
  this.spectrum = new Array(10).fill(0);

  for (let col = 0; col < 10; col++) {
    for (let row = 0; row < 20; row++) {
      if (this.field[row][col] !== 0) {
        this.spectrum[col] = 20 - row;
        break;
      }
    }
  }
};

Player.prototype.markDead = function () {
  this.isAlive = false;
};

Player.prototype.reset = function () {
  this.isAlive = true;
  this.field = this.initializeField();
  this.currentPiece = null;
  this.nextPieces = [];
  this.spectrum = new Array(10).fill(0);
};

Player.prototype.addPenaltyLines = function (count) {
  this.field.splice(0, count);

  for (let i = 0; i < count; i++) {
    const penaltyLine = new Array(10).fill(-1);
    const gapPosition = Math.floor(Math.random() * 10);

    penaltyLine[gapPosition] = 0;

    this.field.push(penaltyLine);
  }

  this.updateSpectrum();
};

Player.prototype.getState = function () {
  return {
    socketId: this.socketId,
    name: this.name,
    isHost: this.isHost,
    isAlive: this.isAlive,
    spectrum: this.spectrum,
  };
};

module.exports = Player;
