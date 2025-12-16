import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { initializeSocket } from "./redux/actions/socketActions";
import Home from "./components/Home";
import GameRoom from "./components/GameRoom";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(initializeSocket());
  }, [dispatch]);

  // /:room/:playerName
  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/^\/([^/]+)\/([^/]+)$/);

    if (match) {
      const [, room, playerName] = match;
      navigate(
        `/game?room=${encodeURIComponent(room)}&player=${encodeURIComponent(
          playerName
        )}`
      );
    }
  }, [location, navigate]);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GameRoom />} />
      </Routes>
    </div>
  );
};

export default App;
