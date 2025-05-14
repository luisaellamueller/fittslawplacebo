import React, { useState, useEffect } from "react";

const MLMouse = () => {
  const [showMLSettings, setShowMLSettings] = useState(false);
  const [mlConnectionState, setMlConnectionState] = useState("connecting");
  const [pingValue, setPingValue] = useState(24);
  
  // ML Parameter als statische Werte
  const mlParameters = {
    sensitivity: {
      value: 100,
      description: "Bestimmt die Empfindlichkeit bei der Erkennung von Zielbewegungen anhand der bisherigen Mausgeschwindigkeit"
    },
    correction: {
      value: 100,
      description: "Korrigiert unkontrollierte Bewegungen, die über das Ziel hinausgehen"
    },
    speed_adaption: {
      value: 100,
      description: "Legt die dynamische Beschleunigung bei grösseren Distanzen fest"
    }
  };
  
  // Simulate TimeGPT connection process for ML mode with more realistic behavior
  useEffect(() => {
    // Add randomness to connection times to simulate network conditions
    const randomizeTime = (baseTime) => baseTime + Math.floor(Math.random() * 10000);
    
    // Determine if we should simulate a connection failure (30% chance)
    const shouldSimulateFailure = Math.random() < 0.3;
    
    // Set number of attempts based on failure simulation
    const connectionAttempts = shouldSimulateFailure ? 2 : (Math.random() < 0.7 ? 1 : 2);
    
    let currentAttempt = 1;
    
    // Attempt connection with possible retry
    const tryConnection = () => {
      if (currentAttempt > 1) {
        // Show reconnecting message for retry attempts
        setMlConnectionState("reconnecting");
      } else {
        setMlConnectionState("connecting");
      }
      
      const connectTime = randomizeTime(1200);
      
      setTimeout(() => {
        if (currentAttempt < connectionAttempts) {
          // Connection failed, show failure and then retry
          setMlConnectionState("connection_failed");
          
          // Wait a moment showing the failure before retry
          setTimeout(() => {
            currentAttempt++;
            tryConnection();
          }, randomizeTime(1500));
        } else {
          // Connection successful, proceed to authentication
          setMlConnectionState("authenticating");
          
          // Authentication phase
          setTimeout(() => {
            // Small chance (10%) of auth delay
            if (Math.random() < 0.1) {
              setMlConnectionState("auth_delay");
              
              setTimeout(() => {
                setMlConnectionState("initializing");
                
                // Initialization phase with variable timing
                setTimeout(() => {
                  setMlConnectionState("connected");
                  // Make the connection state globally available
                  window.mlConnectionState = "connected";
                }, randomizeTime(1600));
              }, randomizeTime(1000));
            } else {
              setMlConnectionState("initializing");
              
              // Initialization phase with variable timing
              setTimeout(() => {
                setMlConnectionState("connected");
                // Make the connection state globally available
                window.mlConnectionState = "connected";
              }, randomizeTime(1600));
            }
          }, randomizeTime(1400));
        }
      }, connectTime);
    };
    
    // Start connection process
    tryConnection();
    
    // Create random ping fluctuations after connection
    let pingUpdateInterval;
    const startPingUpdates = () => {
      // Check every 200ms if we're connected
      const checkInterval = setInterval(() => {
        if (mlConnectionState === "connected") {
          clearInterval(checkInterval);
          
          // Update ping randomly between 18-32ms
          pingUpdateInterval = setInterval(() => {
            setPingValue(Math.floor(Math.random() * 14) + 18);
          }, 2000);
        }
      }, 200);
    };
    
    startPingUpdates();
    
    // Make connection state available to parent component
    window.mlConnectionState = mlConnectionState;
    
    return () => {
      // Clear all timers on unmount
      clearInterval(pingUpdateInterval);
    };
  }, []);

  // Get connection status display
  const getConnectionStatus = () => {
    const getStatusColor = () => {
      switch (mlConnectionState) {
        case "connecting": return "rgba(255, 165, 0, 0.8)"; // orange
        case "reconnecting": return "rgba(255, 120, 0, 0.8)"; // darker orange
        case "connection_failed": return "rgba(255, 0, 0, 0.8)"; // red
        case "authenticating": return "rgba(255, 165, 0, 0.8)"; // orange
        case "auth_delay": return "rgba(255, 190, 0, 0.8)"; // yellow-orange
        case "initializing": return "rgba(173, 216, 230, 0.8)"; // light blue
        case "connected": return "rgba(50, 205, 50, 0.8)"; // green
        default: return "rgba(255, 0, 0, 0.8)"; // red
      }
    };
    
    const getStatusText = () => {
      switch (mlConnectionState) {
        case "connecting": return "Verbindung zu TimeGPT wird hergestellt...";
        case "reconnecting": return "Verbindungsversuch wird wiederholt...";
        case "connection_failed": return "Verbindungsfehler! Erneuter Versuch in Kürze...";
        case "authenticating": return "Authentifiziere API-Zugang...";
        case "auth_delay": return "Erweiterte Authentifizierung erforderlich...";
        case "initializing": return "Initialisiere TimeGPT Engine...";
        case "connected": return "Verbunden mit TimeGPT ✓";
        default: return "Nicht verbunden";
      }
    };
    
    // Display connecting animation
    const renderConnectingAnimation = () => {
      if (mlConnectionState !== "connected" && mlConnectionState !== null) {
        return (
          <div style={{ 
            display: "inline-block", 
            marginLeft: "5px",
            width: "30px"
          }}>
            <span style={{ 
              animation: "blink 1.4s infinite both", 
              animationDelay: "0.2s" 
            }}>.</span>
            <span style={{ 
              animation: "blink 1.4s infinite both", 
              animationDelay: "0.4s" 
            }}>.</span>
            <span style={{ 
              animation: "blink 1.4s infinite both", 
              animationDelay: "0.6s" 
            }}>.</span>
            <style>{`
              @keyframes blink {
                0% { opacity: 0.2; }
                20% { opacity: 1; }
                100% { opacity: 0.2; }
              }
            `}</style>
          </div>
        );
      }
      return null;
    };
          
    return (
      <div style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        padding: "10px 15px",
        borderRadius: "5px",
        marginBottom: "15px",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "5px"
        }}>
          <div style={{ fontWeight: "bold", fontSize: "13px" }}>
            TIMEGPT™ Inference Engine v3.2.17-stable
          </div>
          <div style={{ fontSize: "11px", opacity: 0.7 }}>
            Latency-optimized EU-Central
          </div>
        </div>
        
        <div style={{
          display: "flex",
          alignItems: "center"
        }}>
          <div style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: getStatusColor(),
            marginRight: "10px",
            boxShadow: mlConnectionState === "connected" ? "0 0 5px rgba(50, 205, 50, 0.8)" : "none",
            animation: mlConnectionState === "connecting" || mlConnectionState === "reconnecting" ? "pulse 1.5s infinite" : "none",
            transition: "all 0.3s ease"
          }}></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "bold", marginBottom: "3px" }}>Status:</div>
            <div style={{ fontSize: "14px", display: "flex", alignItems: "center" }}>
              {getStatusText()}
              {renderConnectingAnimation()}
            </div>
          </div>
          {mlConnectionState === "connected" && (
            <div style={{ 
              backgroundColor: "rgba(50, 205, 50, 0.2)", 
              padding: "3px 8px", 
              borderRadius: "4px",
              fontSize: "12px",
              border: "1px solid rgba(50, 205, 50, 0.5)"
            }}>
              Ping: {pingValue}ms
            </div>
          )}
        </div>
        
        {mlConnectionState === "connected" && (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
            padding: "8px",
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: "4px",
            fontSize: "12px"
          }}>
            <div>
              <span style={{opacity: 0.7}}>Modell:</span> TimeGPT-3 Turbo
            </div>
            <div>
              <span style={{opacity: 0.7}}>Threads:</span> 4
            </div>
            <div>
              <span style={{opacity: 0.7}}>Cache:</span> 256MB
            </div>
            <div style={{color: "rgba(50, 205, 50, 0.8)"}}>
              AKTIV
            </div>
          </div>
        )}
        
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.6; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.6; transform: scale(0.95); }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div>
      {getConnectionStatus()}
      
      <ul className="list-disc pl-5 mt-2" style={{ 
        color: "#fff", 
        listStyleType: "disc", 
        paddingLeft: "20px",
        marginTop: "10px"
      }}>
        <li>Ausgleich von Bewegungen, die über die Zielpixel hinausgehen</li>
        <li>TimeGPT Transformer-Modell (Vorhersage der Distanz in Pixel)</li>
        <li>Beschleunigung bei längeren Distanzen</li>
        <li>Latenzausgleich</li>
      </ul>
      
      <div style={{ marginTop: "15px" }}>
        <button 
          onClick={() => setShowMLSettings(!showMLSettings)}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            borderRadius: "4px",
            padding: "8px 12px",
            color: "white",
            cursor: "default",
            fontSize: "14px",
            display: "flex",
            alignItems: "center"
          }}
        >

        {showMLSettings ? "ML-PARAMETER AUSBLENDEN" : "ML-PARAMETER ANZEIGEN"}
          <span>
            {showMLSettings ? "▲" : "▼"}
          </span>
        </button>
        
        {showMLSettings && (
          <div style={{ 
            marginTop: "2px", 
            backgroundColor: "#0a0a0a",
            padding: "6px",
            border: "1px solid #333333",
            fontSize: "10px",
            color: "#cccccc",
            letterSpacing: "-0.5px"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {Object.entries(mlParameters).map(([key, param]) => (
                  <tr key={key} style={{ borderBottom: "1px solid #222222" }}>
                    <td style={{ padding: "4px", width: "30%", color: "#999999" }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </td>
                    <td style={{ padding: "4px", width: "15%" }}>
                      <div style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333333",
                        padding: "2px 4px",
                        textAlign: "center",
                        fontFamily: "monospace"
                      }}>
                        {param.value}
                      </div>
                    </td>
                    <td style={{ padding: "4px", color: "#777777", fontSize: "9px" }}>
                      {param.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ 
              marginTop: "6px", 
              fontSize: "9px", 
              color: "#666666",
              borderTop: "1px solid #222222",
              paddingTop: "4px"
            }}>
              Mit der Nutzung des Systems stimmst du der Datenübertragung an Nixtla zu
            </div>
          </div>
        )}
            
            <div style={{ 
              marginTop: "15px", 
              fontSize: "13px", 
              color: "rgba(255, 255, 255, 0.7)",
              fontStyle: "italic"
            }}>
              Hinweis: Die Parameter werden automatisch während der Aufgabe angepasst. Dies sind nur die Ausgangswerte.
            </div>
          </div>
      </div>
  );
};

export default MLMouse;