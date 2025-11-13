import {useEffect, useState} from "react";
import * as tetris from "../game/tetris";
import "../styles/game.css"
import _ from "lodash";


let DEBUG = false; // Set this to true to see cell values


function requestMoveTetriminoLeft() {
  // Placeholder for server communication
  console.log("Requesting move left from server...");
}

function requestMoveTetriminoRight() {
  // Placeholder for server communication
  console.log("Requesting move right from server...");
}

function requestMoveTetriminoDown() {
  // Placeholder for server communication
  console.log("Requesting move down from server...");
}

function requestRotateTetrimino() {
  // Placeholder for server communication
  console.log("Requesting rotate from server...");
}


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
        { DEBUG ? cell : (cellValToClassName(cell))}</div>
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


  // POUR CELESTE: gérer les inputs clavier pour déplacer les pièces
  // Remplacer chaque ligne de setGrid par une requête au serveur
  useEffect(() => {
    function handleKeyDown(event) {
      if (!gameStarted) return;

      switch (event.key) {
        case 'ArrowLeft':
          setGrid(prevGrid => tetris.moveTetriminoLeft(prevGrid));
          // POUR CELESTE exemple: remplacer la ligne au dessus par:
          // requestMoveTetriminoLeft();
          // le moveTetriminoLeft sera fait côté serveur
          break;
        case 'ArrowRight':
          setGrid(prevGrid => tetris.moveTetriminoRight(prevGrid));
          break;
        case 'ArrowDown':
          setGrid(prevGrid => tetris.moveTetriminoDown(prevGrid));
          break;
        case 'ArrowUp':
          setGrid(prevGrid => tetris.rotateTetrimino(prevGrid));
          break;
        default:
          break;
      }
    }
     document.addEventListener('keydown', handleKeyDown);
     return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted]);
  

  // POUR CELESTE: mettre en commentaire le useEffect et mettre a jour directement la grille avec le serveur 
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setGrid(prevGrid => {

        const newGrid = tetris.processGameTick(prevGrid);
        return newGrid;
      });
      console.log("Grid updated")
      
    }, 200); // Met à jour toutes x millisecondes
    
    return () => {
      clearInterval(interval);
    };
  }, [gameStarted]);
  // FIN COMMENTAIRE pour Celeste

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






