import {useEffect, useState} from "react";
import * as tetris from "../game/tetris";
import "../styles/game.css"
import _ from "lodash";


console.log("Game.jsx loaded")

function TetrisGrid({grid}) {

  const flattenedGrid = grid.flat();


  function cellValToClassName(cellVal) {
    if (cellVal === 0) return '';
    if (typeof cellVal === 'string' && cellVal.startsWith('moving-')) {
      return cellVal.slice(7).toUpperCase();
    }
    if (typeof cellVal === 'string')
      return cellVal.toUpperCase();
    return '';
  }

  return (
    <div className="tetris-grid" >

      {flattenedGrid.map((cell, cellIndex) => (
        <div 
          className={`tetris-cell ${cellValToClassName(cell)}`} 
          key={`${cellIndex}`}
        >
        {cellValToClassName(cell)}</div>
      ))}
    </div>
  )
}

export default function Game() {
  const [grid, setGrid] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  
  function startGame() {
    const newGrid = tetris.createGrid(10, 20);
    console.log(newGrid)
    setGrid(newGrid);
    setGameStarted(true);
  };

  function handleKeyDown(event) {
    if (!gameStarted) return;

    let newGrid;
    switch (event.key) {
      case 'ArrowLeft':
        newGrid = tetris.moveTetriminoLeft(grid);
        setGrid(newGrid);
        break;
      case 'ArrowRight':
        newGrid = tetris.moveTetriminoRight(grid);
        setGrid(newGrid);
        break;
      case 'ArrowDown':
        newGrid = tetris.moveTetriminoDown(grid);
        setGrid(newGrid);
        break;
      case 'ArrowUp':
        newGrid = tetris.rotateTetrimino(grid);
        setGrid(newGrid);
        break;
      default:
        break;
    }
  }
  
    // Effet pour mettre à jour une cellule aléatoire toutes les secondes
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setGrid(prevGrid => {

        const newGrid = tetris.processGameTick(prevGrid);
        return newGrid;
      });
      console.log("Grid updated")
      
    }, 200); // Met à jour toutes x millisecondes
    
     document.addEventListener('keydown', handleKeyDown);



    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyDown);

      
    }
  }, [gameStarted]);


  useEffect(() => {
    startGame();

  }, [])




  return (
    <div>
      <h2>Game Page lolol</h2>
      <button onClick={startGame}>Start Gaeme</button>
      {grid.length > 0 && <TetrisGrid grid={grid} />}
    </div>
  );
}






