import React from "react";
import "./Spectrum.css";

const Spectrum = ({ player, spectrum }) => {
  const heights = spectrum || Array(10).fill(20);

  return (
    <div className="spectrum-container">
      <div className="spectrum-name">{player?.name || "Unknown"}</div>
      <div className="spectrum-grid">
        {heights.map((height, col) => (
          <div key={col} className="spectrum-column">
            {Array(20)
              .fill(null)
              .map((_, row) => (
                <div
                  key={row}
                  className={`spectrum-cell ${row >= height ? "filled" : ""}`}
                />
              ))}
          </div>
        ))}
      </div>
      {player?.isEliminated && (
        <div className="spectrum-eliminated">ELIMINATED</div>
      )}
    </div>
  );
};

export { Spectrum };
