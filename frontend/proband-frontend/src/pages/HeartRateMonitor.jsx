import React, { useState, useEffect } from "react";

const HeartRateMonitor = ({ sensorConnectionState, addSystemLog }) => {
  const [pulseRate, setPulseRate] = useState(72);
  const [pulseVariability, setPulseVariability] = useState(4);
  const [pulseHistory, setPulseHistory] = useState([]);
  const [signalQuality, setSignalQuality] = useState(92);
  const [oxygenSaturation, setOxygenSaturation] = useState(97);
  
  // Generate realistic heart rate data
  const generateRealisticHeartRate = () => {
    // Base heart rate with slight random fluctuation around baseline
    const trend = Math.sin(Date.now() / 10000) * 3; // Slow sinusoidal trend
    const randomFactor = Math.random() * 2 - 1; // Random factor between -1 and 1
    
    // Occasionally add a small jump (stress, movement, etc.)
    const jumpFactor = Math.random() > 0.95 ? (Math.random() * 4 - 2) : 0;
    
    // Calculate new pulse with combined factors
    const newPulse = Math.max(60, Math.min(90, 
      pulseRate + 
      (randomFactor * pulseVariability * 0.3) + // Small random variations
      (trend * 0.2) + // Slow trend
      jumpFactor // Occasional jumps
    ));
    
    return Math.round(newPulse * 10) / 10; // Round to 1 decimal place
  };

  // Generate realistic oxygen saturation data
  const generateRealisticSpO2 = () => {
    // SpO2 usually stays between 95-99% for healthy individuals
    // with minor fluctuations
    const baseSpO2 = oxygenSaturation;
    const randomFactor = (Math.random() * 0.6) - 0.3; // Small random fluctuation
    const newSpO2 = Math.max(95, Math.min(99, baseSpO2 + randomFactor));
    
    return Math.round(newSpO2);
  };

  // Simulate pulse data and SpO2 data
  useEffect(() => {
    if (sensorConnectionState === "connected") {
      // Generate realistic biometric data
      const generateBiometricData = () => {
        // Get new pulse value using realistic function
        const newPulse = generateRealisticHeartRate();
        setPulseRate(newPulse);
        
        // Generate oxygen saturation
        const newSpO2 = generateRealisticSpO2();
        setOxygenSaturation(newSpO2);
        
        // Add to history for possible future use
        setPulseHistory(prev => {
          const newHistory = [...prev, newPulse];
          // Keep only last 50 measurements
          if (newHistory.length > 50) {
            return newHistory.slice(newHistory.length - 50);
          }
          return newHistory;
        });
        
        // Signal quality fluctuations (90-99%)
        const newSignalQuality = Math.round(Math.max(90, Math.min(99, signalQuality + (Math.random() - 0.48) * 2)));
        setSignalQuality(newSignalQuality);
        
        // Add occasional system logs related to heart rate and SpO2
        if (Math.random() > 0.8) {
          const logTypes = [
            `ECG: R-R INT=${(60 / newPulse * 1000).toFixed(0)}ms | AMP=${(Math.random() * 0.4 + 0.8).toFixed(2)}mV`,
            `QRS: DUR=${(Math.random() * 10 + 80).toFixed(0)}ms | PR=${(Math.random() * 20 + 140).toFixed(0)}ms`,
            `RHYTHM: ${newPulse < 65 ? "BRADYCARDIA" : newPulse > 85 ? "TACHYCARDIA" : "NSR"} | ${(newPulse).toFixed(1)}BPM`,
            `SPO2: SAT=${newSpO2}% | PI=${(Math.random() * 3 + 2).toFixed(1)}%`,
            `DIAG: ST=${(Math.random() * 0.1 - 0.05).toFixed(2)}mV | QT=${(Math.random() * 20 + 380).toFixed(0)}ms`
          ];
          addSystemLog(logTypes[Math.floor(Math.random() * logTypes.length)]);
        }
      };
      
      const interval = setInterval(generateBiometricData, 1000);
      return () => clearInterval(interval);
    }
  }, [sensorConnectionState, pulseRate, pulseVariability, signalQuality, oxygenSaturation, addSystemLog]);

  // Render the heart rate and SpO2 monitoring UI
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      marginTop: "10px",
      fontFamily: "Consolas, monospace",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px",
        backgroundColor: "#111111",
        border: "1px solid #333333",
        fontSize: "10px",
        letterSpacing: "-0.5px",
        marginBottom: "6px"
      }}>
        <div>
          <span style={{color: "#777777"}}>GERÄT:</span> <span style={{color: "#cccccc"}}>ECG-912b</span>
        </div>
        <div>
          <span style={{color: "#777777"}}>ABTAST:</span> <span style={{color: "#cccccc"}}>125Hz</span>
        </div>
        <div>
          <span style={{color: "#777777"}}>FILTER:</span> <span style={{color: "#cccccc"}}>0.5-40Hz</span>
        </div>
        <div style={{color: "#dddddd"}}>
          AUFZEICHNUNG
        </div>
      </div>
      

      
      {/* Vital signs display - medical vintage style */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#0a0a0a",
        padding: "6px",
        border: "1px solid #333333",
        fontSize: "10px"
      }}>
        <div style={{textAlign: "center", padding: "4px", border: "1px solid #333333", flex: 1, margin: "0 2px"}}>
          <div style={{color: "#777777", marginBottom: "2px"}}>PULS</div>
          <div style={{
            fontSize: "18px", 
            letterSpacing: "-1px",
            color: "#dddddd",
            fontFamily: "monospace"
          }}>
            {pulseRate.toFixed(0)}
            <span style={{fontSize: "10px", marginLeft: "2px", color: "#aaaaaa"}}>BPM</span>
          </div>
          <div style={{fontSize: "8px", color: "#777777", marginTop: "2px", letterSpacing: "-0.5px"}}>
            {pulseRate > 85 ? "TACHYKARDIE" : pulseRate < 65 ? "BRADYKARDIE" : "NORMALER SINUS"}
          </div>
        </div>
        
        <div style={{textAlign: "center", padding: "4px", border: "1px solid #333333", flex: 1, margin: "0 2px"}}>
          <div style={{color: "#777777", marginBottom: "2px"}}>SPO2</div>
          <div style={{
            fontSize: "18px", 
            letterSpacing: "-1px",
            color: oxygenSaturation >= 95 ? "#dddddd" : oxygenSaturation >= 90 ? "#ffcc00" : "#ff4444",
            fontFamily: "monospace"
          }}>
            {oxygenSaturation}
            <span style={{fontSize: "10px", marginLeft: "2px", color: "#aaaaaa"}}>%</span>
          </div>
          <div style={{fontSize: "8px", color: "#777777", marginTop: "2px", letterSpacing: "-0.5px"}}>
            {oxygenSaturation >= 95 ? "NORMAL" : oxygenSaturation >= 90 ? "LEICHTE HYPOXIE" : "HYPOXÄMIE"}
          </div>
        </div>
        
        <div style={{textAlign: "center", padding: "4px", border: "1px solid #333333", flex: 1, margin: "0 2px"}}>
          <div style={{color: "#777777", marginBottom: "2px"}}>HRV</div>
          <div style={{
            fontSize: "18px", 
            letterSpacing: "-1px",
            color: "#dddddd",
            fontFamily: "monospace"
          }}>
            {(pulseVariability * 4.2).toFixed(0)}
            <span style={{fontSize: "10px", marginLeft: "2px", color: "#aaaaaa"}}>ms</span>
          </div>
          <div style={{fontSize: "8px", color: "#777777", marginTop: "2px", letterSpacing: "-0.5px"}}>
            VARIABILITÄT
          </div>
        </div>
        
        <div style={{textAlign: "center", padding: "4px", border: "1px solid #333333", flex: 1, margin: "0 2px"}}>
          <div style={{color: "#777777", marginBottom: "2px"}}>PERF</div>
          <div style={{
            fontSize: "18px", 
            letterSpacing: "-1px",
            color: "#dddddd",
            fontFamily: "monospace"
          }}>
            {(Math.random() * 3 + 2).toFixed(1)}
            <span style={{fontSize: "10px", marginLeft: "2px", color: "#aaaaaa"}}>%</span>
          </div>
          <div style={{fontSize: "8px", color: "#777777", marginTop: "2px", letterSpacing: "-0.5px"}}>
            PERFUSION
          </div>
        </div>
      </div>
      
      {/* Additional medical data */}
      <div style={{
        display: "flex",
        fontSize: "9px",
        color: "#999999",
        backgroundColor: "#1a1a1a",
        padding: "4px",
        marginTop: "4px",
        fontFamily: "Consolas, monospace",
        justifyContent: "space-between"
      }}>
        <div>ID: ECG-{Math.floor(Math.random()*10000).toString().padStart(4,'0')}</div>
        <div>PAT: #37281</div>
        <div>SEQ: {new Date().toLocaleDateString().replace(/\//g, '')}</div>
        <div>CAL: 1mV/10mm</div>
      </div>
    </div>
  );
};

export default HeartRateMonitor;