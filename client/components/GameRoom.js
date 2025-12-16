import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { joinGame, leaveGame, startGame } from "../redux/actions/socketActions";
import GameBoard from "./GameBoard";
import PlayerList from "./PlayerList";
import SpectrumView from "./SpectrumView";

const GameRoom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    roomName,
    playerName,
    isHost,
    isStarted,
    isFinished,
    players,
    spectrums,
    gameOver,
    winner,
    error,
  } = useSelector((state) => state.game);

  const { connected } = useSelector((state) => state.socket);

  useEffect(() => {
    const room = searchParams.get("room");
    const player = searchParams.get("player");

    if (!room || !player) {
      navigate("/");
      return;
    }

    if (connected && !roomName) {
      dispatch(joinGame(room, player));
    }
  }, [searchParams, connected, roomName, dispatch, navigate]);

  const handleStart = () => {
    dispatch(startGame());
  };

  const handleLeave = () => {
    dispatch(leaveGame());
    navigate("/");
  };

  if (error) {
    return (
      <div className="game-room">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleLeave} className="btn">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="game-room">
        <div className="loading">Connecting to server...</div>
      </div>
    );
  }

  return (
    <div className="game-room">
      <div className="game-header">
        <h2>Room: {roomName}</h2>
        <div className="header-controls">
          {isHost && !isStarted && (
            <button onClick={handleStart} className="btn btn-primary">
              Start Game
            </button>
          )}
          <button onClick={handleLeave} className="btn btn-secondary">
            Leave
          </button>
        </div>
      </div>

      {isFinished && (
        <div className="game-result">
          <h2>{winner ? `${winner} wins!` : "Game Over"}</h2>
          {isHost && (
            <button onClick={handleStart} className="btn btn-primary">
              Play Again
            </button>
          )}
        </div>
      )}

      {(gameOver || isFinished) && (
        <div className="game-over-overlay">
          <h2>
            {isFinished && winner === playerName
              ? "You Won!"
              : gameOver
              ? "You Lost!"
              : "Game Over"}
          </h2>
          <p>{isFinished ? "Game has ended" : "Waiting for game to end..."}</p>
        </div>
      )}

      <div className="game-content">
        <div className="left-panel">
          <PlayerList players={players} currentPlayer={playerName} />
        </div>

        <div className="center-panel">
          {isStarted ? (
            <GameBoard />
          ) : (
            <div className="waiting">
              <h3>Waiting for host to start the game...</h3>
              <p>Players: {players.length}</p>
            </div>
          )}
        </div>

        <div className="right-panel">
          <SpectrumView spectrums={spectrums} currentPlayer={playerName} />
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
