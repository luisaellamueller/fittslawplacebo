import React, { useState, useEffect } from "react";

const SystemTerminal = ({ systemLogs, sensorConnectionState, signalQuality, sensorPingValue }) => {
  const [aiModelLogs, setAiModelLogs] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({
    cpuLoad: 0,
    memoryUsage: 0,
    thermalState: 0,
    powerConsumption: 0,
    networkLatency: 0
  });

  // Basis-Monochrom-Farbschema für einen rohen Terminal-Look
  const getLogColor = (type) => {
    switch (type) {
      case "success": return "#cccccc";
      case "error": return "#ffffff";
      case "warning": return "#aaaaaa";
      case "system": return "#dddddd";
      case "ai_inference": return "#bbbbbb";
      case "ai_model": return "#eeeeee";
      case "critical": return "#ffffff";
      case "ai_train": return "#dddddd";
      default: return "#999999";
    }
  };

  // Generate AI model data
  useEffect(() => {
    if (sensorConnectionState === "connected") {
      const interval = setInterval(() => {
        const now = new Date().toISOString();
        
        // Realistic system metrics
        const newSystemMetrics = {
          cpuLoad: Number((Math.random() * 8 + 16).toFixed(1)), // Higher CPU load for AI processing
          memoryUsage: Number((Math.random() * 25 + 120).toFixed(1)), // Higher memory usage for AI models
          thermalState: Number((Math.random() * 2 + 36).toFixed(1)), // Higher temperatures due to AI processing
          powerConsumption: Number((Math.random() * 0.4 + 0.8).toFixed(3)),
          networkLatency: Number((Math.random() * 2 + 1).toFixed(1))
        };
        setSystemMetrics(newSystemMetrics);

        // AI model data generation - inference statistics, tensor operations, model parameters
        const aiLogTypes = [
          // Inference data
          {
            type: "ai_inference",
            message: `INF: BATCH=${Math.floor(Math.random() * 4 + 1)} | LAT=${(Math.random() * 12 + 8).toFixed(2)}ms | CONF=${(Math.random() * 0.15 + 0.82).toFixed(4)}`
          },
          {
            type: "ai_inference",
            message: `PRED: TD=${(Math.random() * 15 + 45).toFixed(1)}ms | CLS=[${Math.floor(Math.random() * 3)},${Math.floor(Math.random() * 5)}] | P=${(Math.random() * 0.2 + 0.75).toFixed(4)}`
          },
          {
            type: "ai_model",
            message: `MODEL: LSTM_L${Math.floor(Math.random() * 2) + 1} | ACT=${Math.random() > 0.5 ? 'TANH' : 'RELU'} | DROP=${(Math.random() * 0.1 + 0.2).toFixed(2)}`
          },
          {
            type: "ai_model",
            message: `TENSOR: GRAD=${(Math.random() * 0.01).toFixed(5)} | L2=${(Math.random() * 0.001).toFixed(6)} | NORM=${(Math.random() * 1 + 0.5).toFixed(3)}`
          },
          {
            type: "ai_train",
            message: `OPT: LR=${(Math.random() * 0.0001 + 0.0001).toExponential(2)} | BETA=[${(Math.random() * 0.1 + 0.9).toFixed(2)},${(Math.random() * 0.1 + 0.9).toFixed(2)}]`
          },
          {
            type: "ai_train",
            message: `LOSS: VAL=${(Math.random() * 0.2 + 0.1).toFixed(4)} | ΔW=${(Math.random() * 0.01).toExponential(2)} | STEP=${Math.floor(Math.random() * 100 + 1200)}`
          },
          {
            type: "system",
            message: `GPU: UTIL=${Math.floor(Math.random() * 30 + 65)}% | MEM=${Math.floor(Math.random() * 20 + 75)}% | TEMP=${Math.floor(Math.random() * 10 + 75)}°C`
          },
          {
            type: "system",
            message: `QUANT: BITS=8 | SCALE=${(Math.random() * 0.05 + 0.01).toFixed(4)} | ZP=${Math.floor(Math.random() * 128)}`
          }
        ];

        // Select 2-3 random AI log entries for this update
        const numEntries = Math.floor(Math.random() * 2) + 2;
        const aiLogs = [];
        for (let i = 0; i < numEntries; i++) {
          const randomIndex = Math.floor(Math.random() * aiLogTypes.length);
          aiLogs.push({
            timestamp: now,
            type: aiLogTypes[randomIndex].type,
            message: aiLogTypes[randomIndex].message
          });
        }

        // Add system statistics
        const rawSystemLogs = [
          {
            timestamp: now,
            type: "system",
            message: `MCU_STAT: CPU=${newSystemMetrics.cpuLoad}% | MEM=${newSystemMetrics.memoryUsage}MB | TEMP=${newSystemMetrics.thermalState}°C`
          },
          {
            timestamp: now,
            type: "system",
            message: `PWR: VBAT=3.${Math.floor(Math.random() * 30 + 60)}V | I=${(Math.random() * 350 + 450).toFixed(1)}mA | P=${(Math.random() * 1.5 + 1.8).toFixed(2)}W`
          }
        ];

        // Add model architecture details occasionally
        if (Math.random() < 0.2) {
          const layers = ['CONV', 'LSTM', 'ATTN', 'FC', 'GRU', 'BiLSTM'];
          const randomLayers = layers[Math.floor(Math.random() * layers.length)];
          rawSystemLogs.push({
            timestamp: now,
            type: "ai_model",
            message: `ARCH: ${randomLayers} | DIM=${Math.pow(2, Math.floor(Math.random() * 3) + 6)} | HEADS=${Math.floor(Math.random() * 3) + 4}`
          });
        }

        // Add occasional training or optimization logs
        if (Math.random() < 0.15) {
          rawSystemLogs.push({
            timestamp: now,
            type: "ai_train",
            message: `TRN: EPOCH=${Math.floor(Math.random() * 20) + 1}/${Math.floor(Math.random() * 10) + 30} | ACC=${(Math.random() * 0.05 + 0.92).toFixed(4)}`
          });
        }

        // Add occasional error in processing
        if (Math.random() < 0.05) {
          rawSystemLogs.push({
            timestamp: now,
            type: "error",
            message: `ERR: TENSOR_DIM_MISMATCH | SHAPE=[${Math.floor(Math.random() * 10) + 1},${Math.floor(Math.random() * 64) + 32}] | RETRY=${Math.floor(Math.random() * 3) + 1}`
          });
        }

        const newLogs = [...aiLogs, ...rawSystemLogs];
        
        setAiModelLogs(prev => {
          const combinedLogs = [...newLogs, ...prev];
          return combinedLogs.slice(0, 40);
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [sensorConnectionState]);

  // Combine all logs
  const allLogs = [...aiModelLogs, ...(Array.isArray(systemLogs) ? systemLogs : [])].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  ).slice(0, 50);

  return (
    <div style={{
      backgroundColor: "#111111",
      border: "1px solid #333333",
      borderRadius: "0",
      padding: "6px",
      marginTop: "8px",
      fontSize: "11px",
      fontFamily: "Consolas, monospace",
      boxShadow: "none"
    }}>
      <div style={{
        fontWeight: "normal",
        marginBottom: "4px",
        color: "#cccccc",
        borderBottom: "1px solid #333333",
        paddingBottom: "2px",
        fontSize: "10px"
      }}>
        {sensorConnectionState === "connected" ? "NEURALX INFERENCE ENGINE ONLINE" : "AI_INIT_SEQ"}
      </div>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2px",
        marginBottom: "4px",
        fontSize: "9px"
      }}>
        <div style={{backgroundColor: "#1a1a1a", padding: "2px"}}>
          <span style={{color: "#777777"}}>GPU:</span> 
          <span style={{marginLeft: "3px", color: "#dddddd"}}>
            {Math.floor(Math.random() * 20 + 60)}%
          </span>
        </div>
        <div style={{backgroundColor: "#1a1a1a", padding: "2px"}}>
          <span style={{color: "#777777"}}>VRAM:</span> 
          <span style={{marginLeft: "3px", color: "#dddddd"}}>
            {Math.floor(Math.random() * 512 + 512)}MB
          </span>
        </div>
        <div style={{backgroundColor: "#1a1a1a", padding: "2px"}}>
          <span style={{color: "#777777"}}>TEMP:</span> 
          <span style={{marginLeft: "3px", color: "#dddddd"}}>
            {systemMetrics.thermalState.toFixed(1)}°C
          </span>
        </div>
        <div style={{backgroundColor: "#1a1a1a", padding: "2px"}}>
          <span style={{color: "#777777"}}>LAT:</span> 
          <span style={{marginLeft: "3px", color: "#dddddd"}}>
            {(Math.random() * 5 + 10).toFixed(1)}ms
          </span>
        </div>
      </div>
      
      <div style={{
        fontFamily: "Consolas, monospace",
        fontSize: "10px",
        color: "#999999",
        background: "#0a0a0a",
        border: "1px solid #222222",
        padding: "2px",
        margin: "3px 0",
        maxHeight: "250px",
        overflow: "auto",
        whiteSpace: "pre",
        letterSpacing: "-0.5px"
      }}>
        {allLogs.map((log, index) => (
          <div 
            key={index} 
            style={{ 
              color: getLogColor(log.type), 
              marginBottom: "1px",
              fontFamily: "Consolas, monospace",
              lineHeight: "1.2"
            }}
          >
            {log.timestamp.split('T')[1].split('.')[0]} {log.message}
          </div>
        ))}
        
        {allLogs.length === 0 && (
          <>
            <div style={{ color: "#cccccc" }}>00:00:00 NEURAL_ENGINE_INIT</div>
            <div style={{ color: "#cccccc" }}>00:00:01 LOADING_MODEL_WEIGHTS</div>
          </>
        )}
      </div>
      
      {/* AI model stats display */}
      <div style={{
        fontSize: "9px",
        color: "#999999",
        backgroundColor: "#1a1a1a",
        padding: "2px",
        marginTop: "2px",
        fontFamily: "Consolas, monospace"
      }}>
        FLOPS: {(Math.random() * 5 + 15).toFixed(1)}G | MODEL: BiLSTM-{Math.pow(2, Math.floor(Math.random() * 2) + 6)} | INF: {(Math.random() * 5 + 10).toFixed(1)}ms
      </div>
    </div>
  );
};

export default SystemTerminal;