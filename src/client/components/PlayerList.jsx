import React from "react";
import "./PlayerList.css";

const PlayerList = ({ players, currentPlayerId }) => {
  return (
    <div className="player-list">
      <h3>Players</h3>
      <ul>
        {players.map((player) => (
          <li
            key={player.id}
            className={`
              ${player.id === currentPlayerId ? "current" : ""}
              ${player.isHost ? "host" : ""}
              ${player.isEliminated ? "eliminated" : ""}
            `}
          >
            <span className="player-name">{player.name}</span>
            {player.isHost && <span className="host-badge">HOST</span>}
            {player.isEliminated && (
              <span className="eliminated-badge">OUT</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export { PlayerList };
