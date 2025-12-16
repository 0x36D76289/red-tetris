import React from "react";

const SpectrumView = ({ spectrums, currentPlayer }) => {
  const renderSpectrum = (spectrum, playerName) => {
    const maxHeight = 20;

    return (
      <div className="spectrum-item">
        <div className="spectrum-name">{playerName}</div>
        <div className="spectrum-bars">
          {spectrum.map((height, index) => (
            <div
              key={index}
              className="spectrum-bar"
              style={{
                height: `${(height / maxHeight) * 100}%`,
                backgroundColor: "#00f0f0",
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="spectrum-view">
      <h3>Opponent Fields</h3>
      <div className="spectrums">
        {Object.entries(spectrums)
          .filter(([name]) => name !== currentPlayer)
          .map(([name, spectrum]) => (
            <div key={name}>{renderSpectrum(spectrum, name)}</div>
          ))}
      </div>
    </div>
  );
};

export default SpectrumView;
