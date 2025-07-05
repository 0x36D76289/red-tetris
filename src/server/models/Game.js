class Game {
  constructor(roomName) {
    this.roomName = roomName;
    this.players = [];
    this.isStarted = false;
    this.host = null;
  }

  addPlayer(player) {
    this.players.push(player);
    if (this.players.length === 1) {
      this.host = player;
    }
  }

  removePlayer(playerId) {
    this.players = this.players.filter(p => p.id !== playerId);
    if (this.host && this.host.id === playerId && this.players.length > 0) {
      this.host = this.players[0];
    }
  }

  start() {
    this.isStarted = true;
  }

  end() {
    this.isStarted = false;
  }
}

module.exports = Game;
