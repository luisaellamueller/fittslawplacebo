import React from "react";

// Simple component for Standard mouse mode - doesn't need any special UI
const StandardMouse = () => {
  return (
    <div style={{ marginTop: "15px" }}>
      <div style={{ 
        backgroundColor: "rgba(200, 200, 200, 0.2)", 
        padding: "15px", 
        borderRadius: "5px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}>
        <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Standard-Mauseinstellung</div>
        <ul style={{ 
          listStyleType: "disc", 
          paddingLeft: "20px",
          margin: "0"
        }}>
          <li>Keine zusätzliche Unterstützung</li>
          <li>Standard-Mausbeschleunigung des Betriebssystems</li>
          <li>Basiseinstellung zum Vergleich mit KI-Unterstützung</li>
        </ul>
      </div>
    </div>
  );
};

export default StandardMouse;