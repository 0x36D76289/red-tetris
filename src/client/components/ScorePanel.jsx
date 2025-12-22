import React from "react";
import "./ScorePanel.css";

const ScorePanel = ({ score, linesCleared }) => {
  return (
    <div className="score-panel">
      <div className="score-item">
        <span className="score-label">Score</span>
        <span className="score-value">{score || 0}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Lines</span>
        <span className="score-value">{linesCleared || 0}</span>
      </div>
    </div>
  );
};

export { ScorePanel };
