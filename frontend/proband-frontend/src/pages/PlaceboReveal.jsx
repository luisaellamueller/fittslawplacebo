import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlowHelper from "../utility/FlowHelper";
import axios from "axios";

const PlaceboReveal = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4; 
  const navigate = useNavigate();
  const [dataQualityAnswer, setDataQualityAnswer] = useState("");
  const [dataQualityReason, setDataQualityReason] = useState("");

  useEffect(() => {
    let timer;
    FlowHelper.clearVisited();
    if (step === totalSteps) {
      timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 30000); 
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step, navigate]);

  const handleNextClick = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      try {
        if (dataQualityAnswer) {
          await axios.post("http://localhost:5001/api/probands/update-data-quality", {
            use_data: dataQualityAnswer === "yes",
            data_quality_reason: dataQualityReason
          });
        }
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Fehler beim Speichern der Datenqualitätsantwort:", error);
        navigate("/", { replace: true });
      }
    }
  };

  const handlePrevClick = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{
      background: 'var(--background-gradient)',
      backgroundSize: 'cover',
      color: 'var(--text-color)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div className="wide-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Wichtige Information</h2>
          <div className="text-sm">
            Schritt {step} von {totalSteps}
          </div>
        </div>

        {/* Step 1: Placebo Reveal Introduction */}
        {step === 1 && (
          <div className="fade-in">
            <p className="mb-6 text-lg">
              Vielen Dank für Ihre Teilnahme an unserer Studie. Wir möchten Sie nun über den tatsächlichen Zweck und Aufbau der Studie informieren.
            </p>

            <h3 className="text-2xl font-semibold mt-6 mb-4">Der Placeboeffekt in unserer Studie:</h3>
            
            <div className="bg-[rgba(255,255,255,0.1)] p-6 rounded-lg mb-6 border border-[rgba(255,255,255,0.25)]">
              <p className="text-lg mb-4">
                In Wirklichkeit waren alle drei Mauseinstellungen, die Sie getestet haben, <strong>identisch</strong>. Es gab keine speziellen KI-Technologien oder physiologischen Anpassungen.
              </p>
              <p className="text-lg">
                Unsere Studie untersucht, wie Erwartungshaltungen und technische Beschreibungen die wahrgenommene Leistung beeinflussen können - ein Phänomen, das als <strong>Placeboeffekt</strong> bekannt ist.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Study Purpose */}
        {step === 2 && (
          <div className="fade-in">
            <h3 className="text-2xl font-semibold mb-4">Ziel der Studie:</h3>
            <p className="mb-6 text-lg">
              Wir wollten untersuchen, ob die blosse Beschreibung moderner Technologien wie "maschinelles Lernen" oder "physiologische Sensoren" Ihre Wahrnehmung der Mausleistung beeinflussen kann.
            </p>
            <p className="text-lg mt-4">
              Wir hoffen, dass Sie Verständnis für diese notwendige Täuschung haben, da sie für die wissenschaftliche Untersuchung des Placeboeffekts unerlässlich war.
            </p>
          </div>
        )}

        {/* Step 3: Conclusion and Ethics */}
        {step === 3 && (
          <div className="fade-in">
            <h3 className="text-2xl font-semibold mb-4">Datenschutz und Ethik:</h3>
            <p className="mb-6 text-lg">
              Alle Ihre Daten werden anonym behandelt und ausschliesslich für wissenschaftliche Zwecke verwendet.
            </p>

            <div className="bg-[rgba(255,255,255,0.1)] p-6 rounded-lg mb-6 border border-[rgba(255,255,255,0.25)]">
              <p className="text-lg mb-4">
                Die Studie wurde von einer Ethikkommission genehmigt, und diese Art der temporären Täuschung entspricht den ethischen Standards in der Forschung, solange die Teilnehmer im Anschluss vollständig informiert werden.
              </p>
              <p className="text-lg">
                <strong>Wichtiger Hinweis:</strong> Bitte beantworten Sie auf der nächsten Seite noch eine letzte Frage, bevor Sie weitergeleitet werden. Bitte gehen sie diskret mit der Information um, dass die Mauseinstellungen identisch waren, und es sich um einen Beitrag zur Placeboforschung handelt.
              </p>
            </div>

            <p className="text-lg mt-4 text-center">
              Nochmals vielen Dank für Ihre Teilnahme!
            </p>
          </div>
        )}

        {/* Step 4: Data Quality Question */}
        {step === 4 && (
          <div className="fade-in">
            <h3 className="text-2xl font-semibold mb-4">Eine letzte Frage:</h3>
            
            <div className="bg-[rgba(255,255,255,0.1)] p-6 rounded-lg mb-6 border border-[rgba(255,255,255,0.25)]">
              <p className="text-lg mb-4">
                Gerne möchten wir wissen, ob Sie die Fragen seriös beantwortet haben.
              </p>
              <p className="text-lg mb-6">
                Sind Sie der Meinung, dass wir Ihre Daten für die Studie verwenden können?
              </p>
              <p className="text-lg mb-6">
                Ihre Antwort dient der Qualitätssicherung und daher bitten wir um eine ehrliche Einschätzung.
              </p>
              
              <div className="question-section">
                <div className="radio-options-container">
                  <div className="radio-group flex justify-between items-center">
                    <label htmlFor="yes" className="radio-label">Ja</label>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="yes"
                        name="dataQuality"
                        value="yes"
                        checked={dataQualityAnswer === "yes"}
                        onChange={() => setDataQualityAnswer("yes")}
                        className="radio-input"
                      />
                      <div className="radio-circle"></div>
                    </div>
                  </div>
                  
                  <div className="radio-group flex justify-between items-center">
                    <label htmlFor="no" className="radio-label">Nein – Bitte geben Sie den Grund an</label>
                    <div className="radio-option">
                      <input
                        type="radio"
                        id="no"
                        name="dataQuality"
                        value="no"
                        checked={dataQualityAnswer === "no"}
                        onChange={() => setDataQualityAnswer("no")}
                        className="radio-input"
                      />
                      <div className="radio-circle"></div>
                    </div>
                  </div>
                  
                  {dataQualityAnswer === "no" && (
                    <div className="mt-4">
                      <input
                        type="text"
                        value={dataQualityReason}
                        onChange={(e) => setDataQualityReason(e.target.value)}
                        placeholder="Grund eingeben..."
                        className="w-full py-3 px-4 rounded-lg text-white text-base font-normal"
                        style={{ 
                          backgroundColor: 'rgba(94, 93, 112, 0.6)',
                          border: 'none',
                          borderRadius: '10px',
                          height: '40px',
                          width: '92%'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={handleNextClick}
            className="px-6 py-3 bg-[var(--primary-color)] text-white font-semibold rounded-lg shadow-md hover:bg-[var(--secondary-color)] transition-all transform hover:scale-105"
            disabled={step === totalSteps && dataQualityAnswer === ""}
          >
            {step < totalSteps ? "Weiter" : "Zum Studienende"}
          </button>
          
          {step > 1 && step < totalSteps ? (
            <button
              onClick={handlePrevClick}
              className="px-6 py-3 bg-[rgba(255,255,255,0.15)] text-white font-semibold rounded-lg border border-[rgba(255,255,255,0.25)] transition-all hover:bg-[rgba(255,255,255,0.25)]"
            >
              Zurück
            </button>
          ) : (
            <div></div> 
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

export default PlaceboReveal;