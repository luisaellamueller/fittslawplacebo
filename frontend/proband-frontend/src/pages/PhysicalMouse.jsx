import React, { useState, useEffect } from "react";
import HeartRateMonitor from "./HeartRateMonitor";
import SystemTerminal from "./SystemTerminal";

const PhysicalMouse = () => {
  const [physicalStage, setPhysicalStage] = useState("waiting");
  const [sensorConnectionState, setSensorConnectionState] = useState(null);
  const [sensorPingValue, setSensorPingValue] = useState(18);
  const [signalQuality, setSignalQuality] = useState(92);
  const [systemLogs, setSystemLogs] = useState([]);
  
  // Make physical mouse stage available globally
  useEffect(() => {
    window.physicalMouseState = physicalStage;
    window.sensorConnectionState = sensorConnectionState;
  }, [physicalStage, sensorConnectionState]);

  // Add system logs function
  const addSystemLog = (message, type = "info") => {
    const timestamp = new Date().toISOString();
    setSystemLogs(prev => [
      { timestamp, message, type },
      ...prev.slice(0, 14) // Keep only the most recent 15 logs
    ]);
  };

  // Simulate sensor connection process after study leader confirms installation
  useEffect(() => {
    if (physicalStage === "connecting") {
      // Add randomness to connection times
      const randomizeTime = (baseTime) => baseTime + Math.floor(Math.random() * 500);
      
      // Start connection sequence with logs
      setSensorConnectionState("initializing");
      addSystemLog("Initiiere BioSense Sensor", "system");
      addSystemLog("Überprüfe Hardware-Kompatibilität", "system");
      
      setTimeout(() => {
        addSystemLog("Hardware-Check bestanden", "success");
        addSystemLog("Initialisiere multifunktionalen Biosensor", "system");
        setSensorConnectionState("calibrating");
        
        setTimeout(() => {
          addSystemLog("Primärer Sensor online", "success");
          addSystemLog("Kalibriere biometrische Parameter", "system");
          addSystemLog("Optimiere Signalverarbeitung", "system");
          setSensorConnectionState("testing");
          
          setTimeout(() => {
            addSystemLog("Kalibrierung abgeschlossen", "success");
            addSystemLog("Teste Signalqualität", "system");
            
            setTimeout(() => {
              setSensorConnectionState("connected");
              addSystemLog("System betriebsbereit", "success");
              addSystemLog(`Herzfrequenz: ${72.0.toFixed(1)} BPM`, "info");
              addSystemLog(`Sauerstoffsättigung: ${97}%`, "info");
              addSystemLog(`Schweissniveau: ${24}%`, "info");
              addSystemLog(`Signalqualität: ${signalQuality}%`, "info");
              addSystemLog("Datenverarbeitung initialisiert", "system");
              addSystemLog("Lade LSTM-Modell...", "system");
              
              setTimeout(() => {
                addSystemLog("LSTM-Modell geladen", "success");
                addSystemLog("Initialisiere bidirektionales Netzwerk", "system");
                
                setTimeout(() => {
                  addSystemLog("PhysioBERT Adaption aktiviert", "success");
                  addSystemLog("Adaptive Maussteuerung aktiv", "success");
                }, randomizeTime(1200));
              }, randomizeTime(1500));
              
              // Update ping randomly between 12-24ms
              const pingUpdateInterval = setInterval(() => {
                const newPing = Math.floor(Math.random() * 12) + 12;
                setSensorPingValue(newPing);
                
                // Log ping changes occasionally
                if (Math.random() > 0.7) {
                  addSystemLog(`Netzwerklatenz: ${newPing}ms`, "system");
                }
              }, 2000);
              
              return () => {
                clearInterval(pingUpdateInterval);
              };
            }, randomizeTime(1000));
          }, randomizeTime(2000));
        }, randomizeTime(1800));
      }, randomizeTime(1500));
    }
  }, [physicalStage, signalQuality]);

  // Get sensor connection status display for Physical mode
  const getSensorConnectionStatus = () => {
    if (!sensorConnectionState) return null;
    
    const getStatusColor = () => {
      switch (sensorConnectionState) {
        case "initializing": return "rgba(255, 165, 0, 0.8)"; // orange
        case "calibrating": return "rgba(173, 216, 230, 0.8)"; // light blue
        case "testing": return "rgba(255, 190, 0, 0.8)"; // yellow-orange
        case "connected": return "rgba(50, 205, 50, 0.8)"; // green
        default: return "rgba(255, 0, 0, 0.8)"; // red
      }
    };
    
    const getStatusText = () => {
      switch (sensorConnectionState) {
        case "initializing": return "Initialisiere BioSense Sensor...";
        case "calibrating": return "Kalibriere multifunktionalen Sensor...";
        case "testing": return "Teste Signalqualität...";
        case "connected": return "Sensor operationell";
        default: return "Nicht verbunden";
      }
    };
    
    // Display connecting animation
    const renderConnectingAnimation = () => {
      if (sensorConnectionState !== "connected") {
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
        fontFamily: "monospace"
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
            BIOSENSE CONTROLLER v3.2.1-LAB
          </div>
          <div style={{ fontSize: "11px", opacity: 0.7 }}>
            ADAPTIVE BIOFEEDBACK CONTROLLER
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
            boxShadow: sensorConnectionState === "connected" ? "0 0 5px rgba(50, 205, 50, 0.8)" : "none",
            animation: sensorConnectionState !== "connected" ? "pulse 1.5s infinite" : "none",
            transition: "all 0.3s ease"
          }}></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "bold", marginBottom: "3px" }}>STATUS:</div>
            <div style={{ fontSize: "14px", display: "flex", alignItems: "center" }}>
              {getStatusText()}
              {renderConnectingAnimation()}
            </div>
          </div>
          {sensorConnectionState === "connected" && (
            <div style={{ 
              backgroundColor: "rgba(50, 205, 50, 0.2)", 
              padding: "3px 8px", 
              borderRadius: "4px",
              fontSize: "12px",
              border: "1px solid rgba(50, 205, 50, 0.5)"
            }}>
              LAT: {sensorPingValue}ms
            </div>
          )}
        </div>
        
        {/* System terminal component */}
        <SystemTerminal 
          systemLogs={systemLogs}
          sensorConnectionState={sensorConnectionState}
          signalQuality={signalQuality}
          sensorPingValue={sensorPingValue}
        />
        
        {/* Heart rate monitor component */}
        {sensorConnectionState === "connected" && (
          <HeartRateMonitor 
            sensorConnectionState={sensorConnectionState}
            addSystemLog={addSystemLog}
          />
        )}
      </div>
    );
  };

  // Initial waiting state
  if (physicalStage === "waiting") {
    return (
      <div style={{ 
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        padding: "15px",
        borderRadius: "5px",
        border: "1px solid rgba(100, 100, 100, 0.4)",
        marginTop: "15px",
        fontFamily: "Arial, sans-serif"
      }}>
        <div style={{ 
          fontWeight: "bold", 
          fontSize: "16px", 
          marginBottom: "10px",
          color: "#ffcc00"
        }}>
          Versuchsleiter-Präsenz erforderlich
        </div>
        <p style={{ lineHeight: "1.5", fontSize: "14px" }}>
          Für diese Einstellung ist ein biometrischer Sensor erforderlich. <strong>Der Versuchsleiter muss den BioSense™ Multisensor zur gleichzeitigen Erfassung von Herzfrequenz, Sauerstoffsättigung und Schweissniveau einrichten.</strong>  Der Sensor ist nicht-invasiv und wird an Ihrer schwachen hand angebracht. Das adaptive Maussteuerungssystem optimiert Ihre Mausbewegungen in Echtzeit basierend auf Ihren Biosignalen.
        </p>
        <div style={{ 
          marginTop: "12px", 
          display: "flex", 
          alignItems: "center",
          padding: "8px",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "4px",
          fontSize: "13px"
        }}>
          <div className="spinner" style={{
            width: "12px",
            height: "12px",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            borderTop: "2px solid white",
            borderRadius: "50%",
            marginRight: "10px",
            animation: "spin 1s linear infinite"
          }}></div>
          <span>Warte auf Versuchsleiter</span>
          <style>
            {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            `}
          </style>
        </div>
        <div style={{ marginTop: "15px", textAlign: "right" }}>
          <button
            onClick={() => setPhysicalStage("study_leader")}
            style={{
              backgroundColor: "rgba(30, 30, 30, 0.8)",
              color: "white",
              border: "1px solid rgba(100, 100, 100, 0.5)",
              borderRadius: "3px",
              padding: "6px 12px",
              cursor: "default",
              fontSize: "13px",
              transition: "all 0.2s ease"
            }}
          >
            Versuchsleiter anwesend
          </button>
        </div>
      </div>
    );
  }
  
  // Study leader interaction screen - more professional, medical approach
  if (physicalStage === "study_leader") {
    return (
      <div style={{ 
        backgroundColor: "rgba(20, 30, 40, 0.8)",
        padding: "15px",
        borderRadius: "5px",
        border: "1px solid rgba(80, 100, 120, 0.4)",
        marginTop: "15px",
        fontFamily: "Arial, sans-serif"
      }}>
        <div style={{ 
          fontWeight: "bold", 
          fontSize: "15px", 
          marginBottom: "12px",
          color: "#ffffff",
          borderBottom: "1px solid rgba(100, 120, 140, 0.4)",
          paddingBottom: "8px"
        }}>
          BioSense™ Adaptive Sensorinstallationsprotokoll
        </div>
        
        <div style={{
          marginBottom: "12px",
          fontSize: "13px",
          lineHeight: "1.4"
        }}>
          <p><strong>Anweisungen für Proband:</strong> Positionieren Sie Ihren schwachen Arm in entspannter Haltung. Der Multisensor wird an folgendem Messpunkt angebracht. Das System verwendet ein bidirektionales LSTM-Model namens Physiobert, um eine adaptive Maussteuerung basierend auf Ihren Biosignalen zu ermöglichen:</p>
        </div>
        
        <div style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: "4px",
          padding: "10px",
          marginBottom: "12px",
          fontSize: "13px"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px"
          }}>
            <div style={{width: "40%", fontWeight: "bold"}}>Sensortyp</div>
            <div style={{width: "60%"}}>Position</div>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(100, 100, 100, 0.3)",
            paddingTop: "8px"
          }}>
            <div style={{width: "40%"}}>BioSense™ Multisensor</div>
            <div style={{width: "60%"}}>Handgelenk, A. radialis (ventrale Seite)</div>
          </div>
        </div>
        
        <div style={{
          backgroundColor: "rgba(40, 40, 50, 0.5)",
          borderRadius: "4px",
          padding: "8px 10px",
          marginBottom: "15px",
          fontSize: "12px",
          color: "rgba(255, 255, 255, 0.7)"
        }}>
          <div style={{fontWeight: "bold", marginBottom: "4px"}}>Technische Parameter:</div>
          <div style={{display: "flex", justifyContent: "space-between", flexWrap: "wrap"}}>
            <div style={{marginRight: "10px"}}>• Abtastrate: 200 Hz</div>
            <div style={{marginRight: "10px"}}>• BPM-Genauigkeit: ±1%</div>
            <div style={{marginRight: "10px"}}>• SpO2-Genauigkeit: ±2%</div>
            <div style={{marginRight: "10px"}}>• Schweisssensitivität: 10%-99%</div>
          </div>
          <div style={{marginTop: "6px", borderTop: "1px solid rgba(100, 100, 100, 0.3)", paddingTop: "6px"}}>
            <div style={{fontWeight: "bold", marginBottom: "4px"}}>KI-Modell:</div>
            <div style={{display: "flex", justifyContent: "space-between", flexWrap: "wrap"}}>
              <div style={{marginRight: "10px"}}>• Bidirektionales LSTM</div>
              <div style={{marginRight: "10px"}}>• 128 Neuronen</div>
              <div style={{marginRight: "10px"}}>• Dropout: 0.2</div>
              <div>• PhysioBERT basiert</div>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: "right" }}>
          <button
            onClick={() => setPhysicalStage("connecting")}
            style={{
              backgroundColor: "rgba(40, 80, 120, 0.8)",
              color: "white",
              border: "0",
              borderRadius: "3px",
              padding: "8px 15px",
              cursor: "default",
              fontSize: "13px",
              fontWeight: "bold"
            }}
          >
            Sensorinstallation abgeschlossen - Initialisierung starten
          </button>
        </div>
      </div>
    );
  }
  
  // Connected/connecting state with sensor status
  if (physicalStage === "connecting") {
    return getSensorConnectionStatus();
  }
  
  // Fallback (should never happen)
  return (
    <div>Unknown state: {physicalStage}</div>
  );
};

export default PhysicalMouse;