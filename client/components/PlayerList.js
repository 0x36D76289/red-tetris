import React from "react";

const PlayerList = ({ players, currentPlayer }) => {
  return (
    <div className="player-list">
      <h3>Players ({players.length})</h3>
      <div className="players">
        {players.map((player) => (
          <div
            key={player.socketId}
            className={`player-item ${
              player.name === currentPlayer ? "current" : ""
            } ${!player.isAlive ? "dead" : ""}`}
          >
            <span className="player-name">
              {player.name}
              {player.isHost && " (Host)"}
              {player.name === currentPlayer && " (You)"}
            </span>
            <span
              className={`player-status ${player.isAlive ? "alive" : "dead"}`}
            >
              {player.isAlive ? "✓" : "✗"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
