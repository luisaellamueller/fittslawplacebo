import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FlowHelper from "../utility/FlowHelper";

// Map order IDs to mouse type sequences (using the same internal keys)
const orderMappings = {
  1: ["Standard", "ML", "Physiologisch"],
  2: ["Standard", "Physiologisch", "ML"],
  3: ["ML", "Standard", "Physiologisch"],
  4: ["ML", "Physiologisch", "Standard"],
  5: ["Physiologisch", "Standard", "ML"],
  6: ["Physiologisch", "ML", "Standard"],
};

// Map order IDs to flow pages
const flowMappings = {
  1: "/Flow1",
  2: "/Flow2",
  3: "/Flow3",
  4: "/Flow4",
  5: "/Flow5",
  6: "/Flow6",
};

// Customizable titles for the mouse types (display names)
// You can modify these without changing the underlying keys
const mouseTitles = {
  "Standard": "Standard-Mauseinstellung",
  "ML": "Maus mit ML-Optimierung",
  "Physiologisch": "Adaptive Maussteuerung",
};
const SageMakerAuth = () => {
  const [authState, setAuthState] = useState("authenticating");
  const [visible, setVisible] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const userEmail = "luisa.mueller@student.unisg.ch";
  const region = "eu-central-1";
  
  // Production instance is pre-selected
  const selectedInstance = { 
    id: "study",
    name: "ML.PRODSTUDY-2", 
    type: "ml.g5.2xlarge", 
    description: "Productive Environment (8 vCPU, 32 GiB RAM, 256 GB SSD)",
    tags: ["Research", "Production"] 
  };
  
  useEffect(() => {
    // Authentication flow starts immediately
    const authenticateFlow = async () => {
      setLoadingPercent(10);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      setLoadingPercent(25);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      setAuthState("verifying");
      setLoadingPercent(40);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setLoadingPercent(60);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      setAuthState("initializing");
      setLoadingPercent(75);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      setLoadingPercent(90);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      setAuthState("complete");
      setLoadingPercent(100);
      
      // Hide the component after completion
      await new Promise(resolve => setTimeout(resolve, 1500));
      setVisible(false);
      
      // Dispatch event when auth is complete with instance details
      window.dispatchEvent(new CustomEvent('sagemakerAuthComplete', {
        detail: {
          timestamp: new Date().toISOString(),
          region: region,
          instance: selectedInstance.type,
          instanceName: selectedInstance.name,
          user: userEmail
        }
      }));
    };

    authenticateFlow();
  }, []);

  // If not visible, don't render
  if (!visible) return null;
  
  const getStatusText = () => {
    switch (authState) {
      case "authenticating": return "Token gültig bis: 01.05.2025";
      case "verifying": return "Reauthorisierung AWS SageMaker...";
      case "initializing": return `Initialisiere ${selectedInstance.name} Umgebung...`;
      case "complete": return "Authentifizierung abgeschlossen";
      default: return "Verarbeitung...";
    }
  };
  
  return (
    <div 
      data-sagemaker-auth="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        fontFamily: "Amazon Ember, -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <div style={{
        backgroundColor: "#232F3E",
        borderRadius: "8px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        width: "420px",
        padding: "24px",
        color: "white",
        border: "1px solid #3B4A5A",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #FF9900, #FFC400, #FF9900)"
        }}></div>
        <div style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <div style={{
            width: "36px",
            height: "36px",
            marginRight: "16px"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              {/* AWS Logo - Properly implemented SVG */}
              <svg 
                fill="currentColor" 
                fillRule="evenodd" 
                height="36px" 
                width="36px" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>AWS</title>
                <g>
                  <path d="M6.763 11.212c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.39-.384-.59-.894-.59-1.533 0-.678.24-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.4 2.4 0 01-.28.104.488.488 0 01-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167 4.577 4.577 0 011.005-.36 4.84 4.84 0 011.246-.151c.95 0 1.644.216 2.091.647.44.43.662 1.085.662 1.963v2.586h.016zm-3.24 1.214c.263 0 .534-.048.822-.144a1.78 1.78 0 00.758-.51 1.27 1.27 0 00.272-.512c.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 00-.735-.136 6.02 6.02 0 00-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 6.726a1.398 1.398 0 01-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 01.32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 01.311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 01-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 01-.303.08h-.687c-.15 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32L12.32 7.747l-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08l-.686.001zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 01-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.32.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 00.415-.758.777.777 0 00-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 01-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .36.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 01.24.2.43.43 0 01.071.263v.375c0 .168-.064.256-.184.256a.83.83 0 01-.303-.096 3.652 3.652 0 00-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.16.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926a2.157 2.157 0 01-.583.703c-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z" fill="#FFFFFF"></path>
                  <path d="M.378 15.475c3.384 1.963 7.56 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.44-.2.814.287.383.607-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351zm23.531-.2c.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151l.175-.439c.343-.88.802-2.198.52-2.555-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399z" fill="#FF9900"></path>
                </g>
              </svg> 
            </div>
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "500" }}>SageMaker Studio</div>
            <div style={{ fontSize: "13px", color: "#CCC", marginTop: "2px" }}>v9.2.3</div>
          </div>
        </div>
        
        <div style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: "6px",
          padding: "12px 16px",
          marginBottom: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <div style={{ fontWeight: "500", fontSize: "14px", marginBottom: "5px", color: "#FF9900" }}>
            Oauth • AWS IAM
          </div>
          <div style={{ 
            display: "flex",
            alignItems: "center"
          }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "#037F8C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "10px",
              fontSize: "12px",
              fontWeight: "bold"
            }}>
              LM
            </div>
            <div>
              <div style={{ fontSize: "14px" }}>
                {userEmail}
              </div>
              <div style={{ fontSize: "12px", color: "#AAA", marginTop: "2px" }}>
                Role: root • Region: {region}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center",
          marginBottom: "16px",
          justifyContent: "space-between"
        }}>
          <div style={{ fontSize: "15px", fontWeight: "500" }}>
            {getStatusText()}
          </div>
          {authState !== "complete" && (
            <div style={{ 
              width: "20px", 
              height: "20px", 
              border: "2px solid #FF9900",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
          )}
          {authState === "complete" && (
            <div style={{
              width: "22px",
              height: "22px",
              backgroundColor: "#37B76A",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px"
            }}>
              ✓
            </div>
          )}
        </div>
        
        <div style={{
          height: "6px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "3px",
          overflow: "hidden",
          marginBottom: "16px"
        }}>
          <div style={{
            height: "100%",
            backgroundColor: authState === "complete" ? "#37B76A" : "#FF9900",
            width: `${loadingPercent}%`,
            borderRadius: "3px",
            transition: "width 0.4s ease-in-out"
          }}></div>
        </div>
        
        <div style={{
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "6px",
          padding: "12px",
          marginBottom: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            marginBottom: "8px"
          }}>
            <div style={{ fontWeight: "600", fontSize: "14px" }}>
              Instance Details
            </div>
            <div style={{ 
              display: "flex", 
              gap: "6px" 
            }}>
              {selectedInstance.tags.map((tag, idx) => (
                <div key={idx} style={{
                  fontSize: "10px",
                  backgroundColor: tag === "Test" ? "#37B76A" : 
                                   tag === "Development" ? "#1E88E5" : 
                                   tag === "Research" ? "#8E24AA" : 
                                   tag === "Production" ? "#E53935" : "#607D8B",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "12px",
                  fontWeight: "500"
                }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "120px", fontSize: "12px", color: "#AAA" }}>Instance Name:</div>
            <div style={{ fontSize: "12px" }}>{selectedInstance.name}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "120px", fontSize: "12px", color: "#AAA" }}>Instance Type:</div>
            <div style={{ fontSize: "12px" }}>{selectedInstance.type}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "120px", fontSize: "12px", color: "#AAA" }}>Region:</div>
            <div style={{ fontSize: "12px" }}>{region}</div>
          </div>
        </div>
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "12px",
          color: "#888"
        }}>
          <div>Version 2.8.14-ml-compute</div>
          <div>AWS SageMaker Studio</div>
        </div>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

const StudyInformation = () => {
  const [orderId, setOrderId] = useState(null);
  const [studyOrder, setStudyOrder] = useState([]);
  const [step, setStep] = useState(1);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const totalSteps = 3;
  const navigate = useNavigate();

  // Fetch randomized order ID from server
  const fetchOrder = useCallback(() => {
    fetch("http://localhost:5001/api/randomize")
      .then(response => response.json())
      .then(data => {
        console.log("Fetched Order ID:", data.orderId);
        setOrderId(data.orderId);
        setStudyOrder(orderMappings[data.orderId] || []);
      })
      .catch(error => {
        console.error("Error fetching order:", error);
        // Fallback to a default order if fetch fails
        setOrderId(1);
        setStudyOrder(orderMappings[1] || []);
      });
  }, []);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Listen for auth completion event
  useEffect(() => {
    const handleAuthComplete = () => {
      // Continue with navigation after auth completes
      FlowHelper.setFlowPage(flowMappings[orderId]);
      navigate("/FittsTaskTest", { replace: true });
    };
    
    window.addEventListener('sagemakerAuthComplete', handleAuthComplete);
    
    return () => {
      window.removeEventListener('sagemakerAuthComplete', handleAuthComplete);
    };
  }, [orderId, navigate]);

  const handleNextClick = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Show SageMaker Auth overlay when user clicks "Starten"
      setShowAuthOverlay(true);
      // Navigation will happen after auth completes via the event listener
    }
  };

  const handlePrevClick = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Get mouse type descriptions
  const getMouseTypeDescription = (mouseType) => {
    switch (mouseType) {
      case "Standard":
        return (
          "Diese Mauseinstellung erfolgt ohne jegliche Unterstützung und dient als Vergleichsgrundlage.\n" +
          "Sie ermöglicht es, die Leistung der KI-gestützten Systeme mit einer standardmässigen " +
          "Mausführung unter kontrollierten Bedingungen zu vergleichen."
        );
        
      case "ML":
        return (
          "Diese Mauseinstellung nutzt maschinelles Lernen zur Optimierung der Cursorbewegung.\n" +
          "Ruckartige und inkorrekte Bewegungen werden ausgeglichen und längere Cursordistanzen beschleunigt." 
          
        );
        
      case "Physiologisch":
        return (
          "Diese Variante nutzt Biosignale zur adaptiven Steuerung der Mausbewegung in Echtzeit.\n" +
          "Für diese Einstellung ist ein biometrischer Sensor erforderlich. Der Versuchsleiter muss den BioSense™ Multisensor einrichten. "
        );
        
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{
      background: 'var(--background-gradient)',
      backgroundSize: 'cover',
      color: 'var(--text-color)',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Auth overlay - only render when showAuthOverlay is true */}
      {showAuthOverlay && <SageMakerAuth />}
      
      <div className="wide-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Studieninformationen</h2>
          <div className="text-sm">
            Schritt {step} von {totalSteps}
          </div>
        </div>

        {/* Step 1: Study Introduction */}
        {step === 1 && (
          <div className="fade-in">
            <p className="mb-6 text-lg">
              In dieser Studie untersuchen wir, wie sich zwei KI-basierte Maustechnologien auf die 
              Nutzerperformance auswirken. Um dies zu prüfen, werden Sie verschiedene 
              Maus-Einstellungen testen und anschliessend Ihre Erfahrungen bewerten.
            </p>

            <h3 className="text-2xl font-semibold mt-6 mb-4">Ablauf der Studie:</h3>
            {studyOrder.length === 0 ? (
              <div className="flex justify-center items-center h-20">
                <p>Lade Reihenfolge...</p>
              </div>
            ) : (
              <div className="bg-[rgba(255,255,255,0.1)] p-6 rounded-lg mb-6 border border-[rgba(255,255,255,0.25)]">
                <ul className="list-disc pl-6 space-y-3">
                  {studyOrder.map((mouseType, index) => (
                    <li key={index} className="text-lg">
                      <strong>{mouseTitles[mouseType] || mouseType}:</strong> {getMouseTypeDescription(mouseType)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <h3 className="text-2xl font-semibold mt-6 mb-3">Testaufgabe:</h3>
            <p className="text-lg mb-4">
              Sie führen einen Klick-Task durch, bei der Sie so schnell und präzise wie möglich 
              auf Ziele klicken, die auf dem Bildschirm erscheinen. Die Aufgabe wird für jede 
              Maus-Einstellung durchgeführt.
            </p>
          </div>
        )}

        {/* Step 2: Detailed Task Description */}
        {step === 2 && (
          <div className="fade-in">
            <p className="mb-6 text-lg">
              Wie bereits erwähnt, werden Sie im Rahmen der Studie drei verschiedene Maus-Einstellungen 
              testen. Um sicherzustellen, dass Sie die Aufgabe korrekt verstehen, werden Sie zunächst 
              eine Probeaufgabe durchführen.
            </p>

            <h3 className="text-2xl font-semibold mt-4 mb-4">Klick-Task - Details:</h3>
            <div className="bg-[rgba(255,255,255,0.1)] p-6 rounded-lg mb-6 border border-[rgba(255,255,255,0.25)]">
              <ul className="list-disc pl-6 space-y-3">
                <li className="text-lg">
                  Sie klicken abwechselnd auf zwei Ziele, die auf dem Bildschirm erscheinen.
                </li>
                <li className="text-lg">
                  Pro Level werden Sie 15 Ziele treffen müssen.
                </li>
                <li className="text-lg">
                  Ihr Ziel ist es, so schnell und präzise wie möglich zu klicken.
                </li>
                <li className="text-lg">
                  Die 15 Levels werden nicht aufeinander aufbauen, sondern zufällig angeordnet sein.
                </li>
                <li className="text-lg">
                  Wenn Sie zweimal hintereinander neben das Ziel klicken oder zu lange benötigen, 
                  wird das Level wiederholt.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 3: Study Procedure */}
        {step === 3 && (
          <div className="fade-in">
            <h3 className="text-2xl font-semibold mb-4">Nach jeder Aufgabe:</h3>
            <p className="mb-6 text-lg">
              Sie beantworten kurze Fragebögen zu Arbeitsbelastung, wahrgenommener Leistung 
              und Schwierigkeitsgrad.
            </p>

            <h3 className="text-2xl font-semibold mb-4">Ablauf zusammengefasst:</h3>
            <div className="bg-[rgba(255,255,255,0.1)] p-6 rounded-lg mb-6 border border-[rgba(255,255,255,0.25)]">
              <ol className="list-decimal pl-6 space-y-3">
                <li className="text-lg">Testaufgabe: Klick-Task</li>
                <li className="text-lg">Durchführung Klick-Task mit Maus-Einstellung 1: <strong>{studyOrder[0] ? (mouseTitles[studyOrder[0]] || studyOrder[0]) : "Wird geladen..."}</strong></li>
                <li className="text-lg">Physischer und digitaler Fragebogen zur ersten Einstellung</li>
                <li className="text-lg">Durchführung der Klick-Task mit Maus-Einstellung 2: <strong>{studyOrder[1] ? (mouseTitles[studyOrder[1]] || studyOrder[1]) : "Wird geladen..."}</strong></li>
                <li className="text-lg">Physischer und digitaler Fragebogen zur zweiten Einstellung</li>
                <li className="text-lg">Durchführung der Klick-Task mit Maus-Einstellung 3: <strong>{studyOrder[2] ? (mouseTitles[studyOrder[2]] || studyOrder[2]) : "Wird geladen..."}</strong></li>
                <li className="text-lg">Physischer und digitaler Fragebogen zur dritten Einstellung</li>
                <li className="text-lg">Finale Fragen und Abschluss</li>
              </ol>
            </div>

            <p className="mt-4 mb-4 text-lg">
              Die gesamte Studie dauert etwa 10-15 Minuten. Wenn Sie bereit sind, klicken Sie auf "Starten". Für die Testaufgabe werden sie nur 3 Levels mit je 5 Klicks absolvieren.
            </p>
            
            <div className="bg-[rgba(255,255,255,0.05)] p-4 rounded-lg mb-4 border border-[rgba(255,255,255,0.15)] text-sm">
              <p><strong>Hinweis:</strong>  Der Testdurchgang wird nich gespeichert.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={handleNextClick}
            className="px-6 py-3 bg-[var(--primary-color)] text-white font-semibold rounded-lg shadow-md hover:bg-[var(--secondary-color)] transition-all transform hover:scale-105"
          >
            {step < totalSteps ? "Weiter" : "Starten"}
          </button>
          
          {step > 1 ? (
            <button
              onClick={handlePrevClick}
              className="px-6 py-3 bg-[rgba(255,255,255,0.15)] text-white font-semibold rounded-lg border border-[rgba(255,255,255,0.25)] transition-all hover:bg-[rgba(255,255,255,0.25)]"
            >
              Zurück
            </button>
          ) : (
            <div></div> // Empty div to maintain layout
          )}
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StudyInformation;