import React, { useState } from "react";
import StandardMouse from "./StandardMouse";
import MLMouse from "./MLMouse";
import PhysicalMouse from "./PhysicalMouse";

const MouseInfoPopup = ({ mouseType, onClose }) => {
  const [visible, setVisible] = useState(true);

  // Get the appropriate mouse description based on the type
  const getMouseDescription = () => {
    switch (mouseType) {
      case "Standard":
        return {
          title: "Baseline",
          description: "Diese Mauseinstellung erfolgt ohne jegliche Unterstützung und dient dazu, die KI-unterstützen Systeme mit der Standard Einstellung in einem kontrollierten Umfeld zu vergleichen."
        };
      case "ML":
        return {
          title: "ML-unterstützte Mausführung",
          description: "In dieser Einstellung wird die Mausführung durch maschinelles Lernen unterstützt, indem ruckartige und inkorrekte Bewegungen ausgeglichen und längere Cursordistanzen beschleunigt werden. Das System analysiert die (x,y)-Koordinaten und Geschwindigkeitsvektoren der Maus in einem Sliding Window (250 ms mit 50 ms Overlap). Mithilfe des Zeitserienmodells TimeGPT (transformer-basiert) werden Bewegungsmuster erfasst und die optimale Zielgeschwindigkeit für die nächsten 100 ms vorhergesagt."
        };
      case "Physical":
        return {
          title: "Adaptiv-unterstützte Mausführung",
          description: ""
        };
      default:
        return {
          title: "Mauseinstellung",
          description: "Keine spezifische Beschreibung verfügbar."
        };
    }
  };

  const handleClose = () => {
    // For all modes, allow closing the popup to proceed to the Fitts task
    // This fixes the button issue
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const mouseInfo = getMouseDescription();

  // Render the appropriate component based on mouse type
  const renderMouseContent = () => {
    switch (mouseType) {
      case "Standard":
        return <StandardMouse />;
      case "ML":
        return <MLMouse />;
      case "Physical":
        return <PhysicalMouse />;
      default:
        return null;
    }
  };

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
          width: "600px",
          maxWidth: "90%",
          maxHeight: "90%",
          overflow: "auto"
        }}
      >
        <div style={{ padding: "20px" }}>
          <h2 style={{ textAlign: "center", margin: "0 0 15px", color: "#333" }}>
            Mauseinstellung: <strong>{mouseInfo.title}</strong>
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
            <p style={{ lineHeight: "1.6" }}>{mouseInfo.description}</p>
            {renderMouseContent()}
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
              {/* Always display "Task Starten" or "Zum Fitts Task" to ensure the button works properly */}
              Zum Fitts Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MouseInfoPopup;