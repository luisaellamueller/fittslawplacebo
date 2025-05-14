// SageMaker Auth Component
const SageMakerAuth = () => {
    const [authState, setAuthState] = useState("authenticating");
    const [visible, setVisible] = useState(true);
    const userEmail = "luisa.mueller@student.unisg.ch";
    
    useEffect(() => {
      // Simulate authentication process
      setTimeout(() => {
        setAuthState("verifying");
        
        setTimeout(() => {
          setAuthState("initializing");
          
          setTimeout(() => {
            setAuthState("complete");
            
            // Hide the component after completion
            setTimeout(() => {
              setVisible(false);
              // Dispatch event when auth is complete
              window.dispatchEvent(new CustomEvent('sagemakerAuthComplete'));
            }, 1200);
          }, 1800);
        }, 1500);
      }, 2000);
    }, []);
  
    // If not visible, don't render
    if (!visible) return null;
    
    const getStatusText = () => {
      switch (authState) {
        case "authenticating": return "Authentifizierung mit AWS SageMaker...";
        case "verifying": return "Überprüfe Zugangsdaten...";
        case "initializing": return "Initialisiere ML-Ressourcen...";
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
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          fontFamily: "Amazon Ember, Arial, sans-serif"
        }}
      >
        <div style={{
          backgroundColor: "#232F3E",
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          width: "380px",
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
            background: "linear-gradient(to right, #65dfc9, #6cdbeb, #c58fff)"
          }}></div>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <div style={{
              width: "32px",
              height: "32px",
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
                  height="32px" 
                  width="32px" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>AWS</title>
                  <g>
                    <path d="M6.763 11.212c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.39-.384-.59-.894-.59-1.533 0-.678.24-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.4 2.4 0 01-.28.104.488.488 0 01-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167 4.577 4.577 0 011.005-.36 4.84 4.84 0 011.246-.151c.95 0 1.644.216 2.091.647.44.43.662 1.085.662 1.963v2.586h.016zm-3.24 1.214c.263 0 .534-.048.822-.144a1.78 1.78 0 00.758-.51 1.27 1.27 0 00.272-.512c.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 00-.735-.136 6.02 6.02 0 00-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 6.726a1.398 1.398 0 01-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 01.32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 01.311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 01-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 01-.303.08h-.687c-.15 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32L12.32 7.747l-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08l-.686.001zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 01-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.32.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 00.415-.758.777.777 0 00-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 01-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .36.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 01.24.2.43.43 0 01.071.263v.375c0 .168-.064.256-.184.256a.83.83 0 01-.303-.096 3.652 3.652 0 00-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.16.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926a2.157 2.157 0 01-.583.703c-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z"></path>
                    <path d="M.378 15.475c3.384 1.963 7.56 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.44-.2.814.287.383.607-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351zm23.531-.2c.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151l.175-.439c.343-.88.802-2.198.52-2.555-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399z" fill="#F90"></path>
                  </g>
                </svg> 
              </div>
            </div>
            <div>
              <div style={{ fontSize: "14px", color: "#CCC" }}>Model Reauthorization</div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "6px",
            padding: "16px",
            marginBottom: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            <div style={{ fontWeight: "500", fontSize: "14px", marginBottom: "5px" }}>
              Account
            </div>
            <div style={{ 
              display: "flex",
              alignItems: "center"
            }}>
              <div style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "#037F8C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "8px",
                fontSize: "12px",
                fontWeight: "bold"
              }}>
                LM
              </div>
              <div style={{ fontSize: "14px" }}>
                {userEmail}
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
                width: "20px",
                height: "20px",
                backgroundColor: "#37B76A",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "12px"
              }}>
                ✓
              </div>
            )}
          </div>
          
          {authState === "verifying" && (
            <div style={{
              fontSize: "13px",
              color: "#AAA",
              marginBottom: "10px"
            }}>
              Validiere IAM-Berechtigungen und Sicherheitstoken...
            </div>
          )}
          
          {authState === "initializing" && (
            <div style={{
              fontSize: "13px",
              color: "#AAA",
              marginBottom: "10px"
            }}>
              Bereitstellen der ml.g4dn.xlarge EC2-Instance mit CUDA Compute...
            </div>
          )}
          
          <div style={{
            height: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "2px",
            overflow: "hidden"
          }}>
            <div style={{
              height: "100%",
              backgroundColor: authState === "complete" ? "#37B76A" : "#FF9900",
              width: authState === "authenticating" ? "30%" :
                    authState === "verifying" ? "60%" :
                    authState === "initializing" ? "90%" : "100%",
              transition: "width 0.5s ease"
            }}></div>
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
  
  export default SageMakerAuth;