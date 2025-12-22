import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Board } from "../components/Board.jsx";
import { NextPiece } from "../components/NextPiece.jsx";
import { Spectrum } from "../components/Spectrum.jsx";
import { ScorePanel } from "../components/ScorePanel.jsx";
import { PlayerList } from "../components/PlayerList.jsx";
import { Controls } from "../components/Controls.jsx";
import { useGameLoop } from "../hooks/useGameLoop.js";
import {
  setRoom,
  setPlayer,
  setGame,
  setError,
  leaveRoom,
} from "../store/gameSlice.js";
import {
  initSocket,
  joinGame,
  leaveGame,
  startGame as startGameSocket,
  restartGame as restartGameSocket,
} from "../socket/socketService.js";
import "./GameRoom.css";

const GameRoom = () => {
  const { room, player: playerName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isJoining, setIsJoining] = useState(true);
  const [connectionError, setConnectionError] = useState(null);

  const {
    player,
    game,
    isHost,
    isPlaying,
    isGameOver,
    board,
    currentPiece,
    nextPieces,
    pieceIndex,
    score,
    linesCleared,
    opponents,
    spectrums,
    winner,
    error,
  } = useSelector((state) => state.game);

  useGameLoop(room);

  useEffect(() => {
    const join = async () => {
      try {
        initSocket();
        dispatch(setRoom(room));

        const result = await joinGame(room, playerName);

        dispatch(setPlayer(result.player));
        dispatch(setGame(result.game));
        setIsJoining(false);
      } catch (err) {
        setConnectionError(err.message);
        setIsJoining(false);
      }
    };

    join();

    return () => {
      if (room) {
        leaveGame(room);
        dispatch(leaveRoom());
      }
    };
  }, [room, playerName, dispatch]);

  const handleStartGame = useCallback(async () => {
    try {
      await startGameSocket(room);
    } catch (err) {
      dispatch(setError(err.message));
    }
  }, [room, dispatch]);

  const handleRestartGame = useCallback(async () => {
    try {
      await restartGameSocket(room);
    } catch (err) {
      dispatch(setError(err.message));
    }
  }, [room, dispatch]);

  const handleLeave = useCallback(() => {
    if (room) {
      leaveGame(room);
      dispatch(leaveRoom());
    }
    navigate("/");
  }, [room, navigate, dispatch]);

  const nextPiece = nextPieces[pieceIndex + 1];

  if (isJoining) {
    return (
      <div className="game-room loading">
        <div className="loading-content">
          <div className="spinner" />
          <p>Joining room...</p>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="game-room error">
        <div className="error-content">
          <h2>Failed to Join</h2>
          <p>{connectionError}</p>
          <button onClick={() => navigate("/")} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-room">
      <header className="game-header">
        <h1>
          <span className="red">RED</span> TETRIS
        </h1>
        <div className="room-info">
          <span className="room-name">Room: {room}</span>
          <button onClick={handleLeave} className="leave-button">
            Leave
          </button>
        </div>
      </header>

      <main className="game-main">
        <aside className="game-sidebar left">
          <PlayerList
            players={game?.players || []}
            currentPlayerId={player?.id}
          />

          {opponents.length > 0 && (
            <div className="opponents-spectrums">
              <h3>Opponents</h3>
              <div className="spectrums-grid">
                {opponents.map((opponent) => (
                  <Spectrum
                    key={opponent.id}
                    player={opponent}
                    spectrum={spectrums[opponent.id]}
                  />
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="game-center">
          {!isPlaying && !isGameOver && game && !game.isStarted && (
            <div className="game-overlay lobby">
              <h2>Waiting for players...</h2>
              <p>{game.players?.length || 0} player(s) in room</p>
              {isHost ? (
                <button onClick={handleStartGame} className="start-button">
                  Start Game
                </button>
              ) : (
                <p className="waiting-text">Waiting for host to start...</p>
              )}
            </div>
          )}

          {isGameOver && (
            <div className="game-overlay gameover">
              <h2>
                {winner
                  ? winner.id === player?.id
                    ? ":D GG !"
                    : `${winner.name} Wins!`
                  : "Gros noob !"}
              </h2>
              {isHost && (
                <button onClick={handleRestartGame} className="restart-button">
                  Play Again
                </button>
              )}
              {!isHost && (
                <p className="waiting-text">Waiting for host to restart...</p>
              )}
            </div>
          )}

          <Board
            board={board}
            currentPiece={currentPiece}
            showGhost={isPlaying}
          />
        </div>

        <aside className="game-sidebar right">
          <NextPiece piece={nextPiece} />
          <ScorePanel score={score} linesCleared={linesCleared} />
          <Controls />
        </aside>
      </main>

      {error && <div className="game-error-toast">{error}</div>}
    </div>
  );
};

export { GameRoom };
