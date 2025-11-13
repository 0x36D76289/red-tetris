import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route, Link} from "react-router";
import Home from "./views/Home";
import About from "./views/About";
import Game from "./views/Game";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      {/* <h1>coucou</h1> */}
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/game">Game</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App

