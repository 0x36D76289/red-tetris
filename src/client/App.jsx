import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import { GameRoom } from "./pages/GameRoom.jsx";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:room/:player" element={<GameRoom />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export { App };
