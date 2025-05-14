import React, { useState } from "react";

const TestSessionPopup = ({ onClose }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          width: "500px",
          maxWidth: "90%",
          overflow: "auto"
        }}
      >
        <div style={{ padding: "20px" }}>
          <h2 style={{ textAlign: "center", margin: "0 0 15px", color: "#333" }}>
            Fitts Task: Test Session
          </h2>
          
          <div
            style={{
              backgroundColor: "rgba(25, 45, 95, 0.7)",
              color: "white",
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "6px",
              marginBottom: "20px"
            }}
          >
            <p style={{ lineHeight: "1.6" }}>
              In dieser Test-Session werden Sie einen Fitts-Task absolvieren, der dazu dient, 
              Ihre Fähigkeit zur Zielbewegung und -auswahl zu messen.
            </p>
            <p style={{ lineHeight: "1.6" }}>
              Bitte klicken Sie so schnell und genau wie möglich auf die blauen Zielfelder, 
              die auf dem Bildschirm erscheinen werden.
            </p>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleClose}
              style={{
                padding: "12px 30px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "default",
                backgroundColor: "rgba(25, 45, 95, 0.7)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(8px)",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(35, 60, 120, 0.8)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(25, 45, 95, 0.7)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
              }}
            >
              Test starten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSessionPopup;