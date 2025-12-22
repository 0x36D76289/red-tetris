import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError("");

      const trimmedRoom = roomName.trim();
      const trimmedPlayer = playerName.trim();

      if (!trimmedRoom) {
        setError("Please enter a room name");
        return;
      }

      if (!trimmedPlayer) {
        setError("Please enter your player name");
        return;
      }

      const validNameRegex = /^[a-zA-Z0-9_]+$/;

      if (!validNameRegex.test(trimmedRoom)) {
        setError(
          "Room name can only contain letters, numbers, and underscores"
        );
        return;
      }

      if (!validNameRegex.test(trimmedPlayer)) {
        setError(
          "Player name can only contain letters, numbers, and underscores"
        );
        return;
      }

      navigate(`/${trimmedRoom}/${trimmedPlayer}`);
    },
    [roomName, playerName, navigate]
  );

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="title">
          <span className="red">RED</span> TETRIS
        </h1>

        <p className="subtitle">Multiplayer Tetris Battle</p>

        <form onSubmit={handleSubmit} className="join-form">
          <div className="form-group">
            <label htmlFor="roomName">Room Name</label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              maxLength={20}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="playerName">Your Name</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              autoComplete="off"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="join-button">
            Join Game
          </button>
        </form>

        <div className="features">
          <div className="feature">
            <span className="feature-icon">🎮</span>
            <span className="feature-text">Real-time Multiplayer</span>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span className="feature-text">Penalty Lines</span>
          </div>
          <div className="feature">
            <span className="feature-icon">👀</span>
            <span className="feature-text">Live Spectrum View</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Home };
