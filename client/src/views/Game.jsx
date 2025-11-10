import {useEffect, useState} from "react";
import * as tetris from "../game/tetris";
import "../styles/game.css"
import _, { set } from "lodash";


console.log("Game.jsx loaded")

function TetrisGrid({grid}) {

  const flattenedGrid = grid.flat();

  return (
    <div className="tetris-grid" >

      {flattenedGrid.map((cell, cellIndex) => (
        <div 
          className={`tetris-cell ${cell || ''}`} 
          key={`${cellIndex}`}
        >
        {cell}</div>
      ))}


    </div>
  )
}

export default function Game() {
  const [grid, setGrid] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [tetriminoPositions, setTetriminoPositions] = useState([]);
  
  function startGame() {
    const newGrid = tetris.createGrid(10, 20);
    console.log(newGrid)
    setGrid(newGrid);
    const randomTetrimino = tetris.generateRandomTetrimino();
    const { grid: gridWithTetrimino, tetriminoPositions} = tetris.spawnTetrimino(newGrid, randomTetrimino.letter);
    console.log(gridWithTetrimino);
    setGrid(gridWithTetrimino);
    setTetriminoPositions(tetriminoPositions);
    setGameStarted(true);
  };
  
    // Effet pour mettre à jour une cellule aléatoire toutes les secondes
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setGrid(prevGrid => {
        // const newGrid = _.cloneDeep(prevGrid);
        // const randomRow = Math.floor(Math.random() * newGrid.length);
        // const randomCol = Math.floor(Math.random() * newGrid[0].length);
        // const tetriminoLetters = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        // const randomLetter = _.sample(tetriminoLetters);
        // newGrid[randomRow][randomCol] = randomLetter;
        const newGameState = tetris.moveTetriminoDown(prevGrid, tetriminoPositions);
        // console.log("New Game State:", newGameState);
        setTetriminoPositions(newGameState.tetriminoPositions);

        return newGameState.grid;
      });
      console.log("Grid updated")
      
    }, 200); // Met à jour toutes les secondes

    return () => clearInterval(interval);
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






