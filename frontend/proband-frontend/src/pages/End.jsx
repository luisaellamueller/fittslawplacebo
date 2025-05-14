import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const End = () => {
  const navigate = useNavigate();
  const [background, setBackground] = useState("");
  const [gender, setGender] = useState("");
  const [selfDescribedGender, setSelfDescribedGender] = useState("");
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  
  const handleSubmitAll = async () => {
    // First save the background
    if (!background) {
      alert("Bitte wählen Sie eine Option zum technischen Hintergrund aus.");
      return;
    }
    
    // Then check and save gender
    if (!gender) {
      alert("Bitte wählen Sie eine Geschlechts-Option aus.");
      return;
    }
    
    // Validate if user selected self-describe but didn't provide a description
    if (gender === "selbst beschreiben" && !selfDescribedGender) {
      alert("Bitte geben Sie eine Selbstbeschreibung ein.");
      return;
    }
    
    try {
      // First save technical background
      await axios.post("http://localhost:5001/api/probands/update-background", {
        technischer_studiengang: background === "technical",
      });
      
      // Then save gender information
      await axios.post("http://localhost:5001/api/probands/update-gender", {
        gender,
        self_described_gender: selfDescribedGender,
      });
      
      // Show verbal feedback prompt instead of immediately navigating
      setShowFeedbackPrompt(true);
    } catch (error) {
      console.error("Fehler beim Speichern der Antworten:", error);
      alert("Fehler beim Speichern der Antworten.");
    }
  };
  
  const handleCompleteFeedback = () => {
    alert("Vielen Dank für Ihre Teilnahme!");
    navigate("/PlaceboReveal");
  };
  
  return (
    <div className="form-container" style={{scale: '0.85'}}>
      {!showFeedbackPrompt ? (
        <>
          <h2>Letzte Fragen</h2>
          
          {/* Technical Background Question */}
          <div className="question-section">
            <p className="question-title">Studieren Sie einen MINT-Studiengang? (Mathematik, Informatik, Naturwissenschaften, Technik)</p>
            <div className="radio-options-container">
              <div className="radio-group flex justify-between items-center">
                <label htmlFor="technical" className="radio-label">Ja, MINT</label>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="technical"
                    name="background"
                    value="technical"
                    checked={background === "technical"}
                    onChange={() => setBackground("technical")}
                    className="radio-input"
                  />
                  <div className="radio-circle"></div>
                </div>
              </div>
              
              <div className="radio-group flex justify-between items-center">
                <label htmlFor="non-technical" className="radio-label">Nein, kein MINT</label>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="non-technical"
                    name="background"
                    value="non-technical"
                    checked={background === "non-technical"}
                    onChange={() => setBackground("non-technical")}
                    className="radio-input"
                  />
                  <div className="radio-circle"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Gender Question */}
          <div className="question-section">
            <p className="question-title">Was ist Ihr Geschlecht?</p>
            <div className="radio-options-container">
              <div className="radio-group flex justify-between items-center">
                <label htmlFor="woman" className="radio-label">Frau</label>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="woman"
                    name="gender"
                    value="Frau"
                    checked={gender === "Frau"}
                    onChange={(e) => setGender(e.target.value)}
                    className="radio-input"
                  />
                  <div className="radio-circle"></div>
                </div>
              </div>
              
              <div className="radio-group flex justify-between items-center">
                <label htmlFor="man" className="radio-label">Mann</label>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="man"
                    name="gender"
                    value="Mann"
                    checked={gender === "Mann"}
                    onChange={(e) => setGender(e.target.value)}
                    className="radio-input"
                  />
                  <div className="radio-circle"></div>
                </div>
              </div>
              
              <div className="radio-group flex justify-between items-center">
                <label htmlFor="non-binary" className="radio-label">nicht-binär</label>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="non-binary"
                    name="gender"
                    value="nicht-binär"
                    checked={gender === "nicht-binär"}
                    onChange={(e) => setGender(e.target.value)}
                    className="radio-input"
                  />
                  <div className="radio-circle"></div>
                </div>
              </div>
              
              <div className="radio-group flex justify-between items-center">
                <label htmlFor="prefer-not-to-disclose" className="radio-label">keine Angabe</label>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="prefer-not-to-disclose"
                    name="gender"
                    value="keine Angabe"
                    checked={gender === "keine Angabe"}
                    onChange={(e) => setGender(e.target.value)}
                    className="radio-input"
                  />
                  <div className="radio-circle"></div>
                </div>
              </div>
              
              <div className="radio-group flex justify-between items-center">
                <label htmlFor="prefer-to-self-describe" className="radio-label">selbst beschreiben</label>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="prefer-to-self-describe"
                    name="gender"
                    value="selbst beschreiben"
                    checked={gender === "selbst beschreiben"}
                    onChange={(e) => setGender(e.target.value)}
                    className="radio-input"
                  />
                  <div className="radio-circle"></div>
                </div>
              </div>
              
              {gender === "selbst beschreiben" && (
                <div className="self-describe-field mt-4">
                  <input
                    type="text"
                    value={selfDescribedGender}
                    onChange={(e) => setSelfDescribedGender(e.target.value)}
                    placeholder="Geschlecht eingeben..."
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
          
          <button onClick={handleSubmitAll} className="submit-button">
            <span className="checkmark"></span> Antworten speichern & fortfahren
          </button>
        </>
      ) : (
        <div className="feedback-instructions">
          <h2>Mündliches Feedback</h2>
          
          <div className="instruction-card" style={{ 
            backgroundColor: 'rgba(94, 93, 112, 0.3)',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <p style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
              Bitte warten Sie, während die Studienleiterin Ihre Antworten auf die folgenden Fragen aufnimmt:
            </p>
            
            <div style={{ 
              backgroundColor: 'rgba(94, 93, 112, 0.6)',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <p style={{ fontWeight: 'bold' }}>Frage 1:</p>
              <p>"Wie ist Ihr ehrliches Feedback zu den zwei Mauseinstellungen?"</p>
            </div>
            
            <div style={{ 
              backgroundColor: 'rgba(94, 93, 112, 0.6)',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <p style={{ fontWeight: 'bold' }}>Frage 2:</p>
              <p>"Was könnte noch verbessert werden?"</p>
            </div>
          </div>
          
          <button 
            onClick={handleCompleteFeedback} 
            className="submit-button"
            style={{ marginTop: '20px' }}
          >
            <span className="checkmark"></span> Feedback abgeschlossen & beenden
          </button>
        </div>
      )}
    </div>
  );
};

export default End;