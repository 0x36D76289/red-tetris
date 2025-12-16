import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();

    if (roomName && playerName) {
      navigate(
        `/game?room=${encodeURIComponent(roomName)}&player=${encodeURIComponent(
          playerName
        )}`
      );
    }
  };

  return (
    <div className="home">
      <div className="home-container">
        <h1 className="title">Red Tetris</h1>
        <p className="subtitle">
          Multiplayer Tetris with Full Stack JavaScript
        </p>

        <form onSubmit={handleJoin} className="join-form">
          <div className="form-group">
            <label htmlFor="room">Room Name</label>
            <input
              id="room"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="player">Player Name</label>
            <input
              id="player"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Join Game
          </button>
        </form>

        <div className="info">
          <h3>How to Play</h3>
          <ul>
            <li>← → : Move piece left/right</li>
            <li>↑ : Rotate piece</li>
            <li>↓ : Soft drop</li>
            <li>Space : Hard drop</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
