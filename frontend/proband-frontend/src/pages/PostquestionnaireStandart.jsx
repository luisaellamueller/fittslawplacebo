import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlowHelper from "../utility/FlowHelper";

const PostQuestionnaireStandard = () => {
  const [responses, setResponses] = useState({
    frequent_use: null,
    complexity: null,
    easy_to_use: null,
    tech_support: null,
    functions_integrated: null,
    everything_fits: null,
    quick_learning: null,
    intuitive: null,
    felt_secure: null,
    little_learning: null,
  });

  const [probandId, setProbandId] = useState(null);
  const [showTlxModal, setShowTlxModal] = useState(true);
  const navigate = useNavigate();

  // Load proband ID from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("probandId");
    if (storedId) {
      setProbandId(Number(storedId)); // Ensure it's stored as a number
    } else {
      setProbandId(3);
      localStorage.setItem("probandId", 3);
    }
  }, []);

  // Handle form submission (send data to the backend)
  const handleSave = async () => {
    if (!probandId) {
      alert("Fehler: Proband ID fehlt!");
      return;
    }
    
    // Check if all fields are filled
    const hasEmptyFields = Object.values(responses).some(value => value === null);
    if (hasEmptyFields) {
      alert("Bitte beantworten Sie alle Fragen!");
      return;
    }

    const postData = {
      proband_id: probandId,
      maus_typ: "Standard",
      frequent_use: responses.frequent_use,
      complexity: responses.complexity,
      easy_to_use: responses.easy_to_use,
      tech_support: responses.tech_support,
      functions_integrated: responses.functions_integrated,
      everything_fits: responses.everything_fits,
      quick_learning: responses.quick_learning,
      intuitive: responses.intuitive,
      felt_secure: responses.felt_secure,
      little_learning: responses.little_learning,
    };

    try {
      const response = await fetch("http://localhost:5001/api/post-questionnaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Speichern des Fragebogens.");
      }

      alert("Erfolgreich gespeichert.");
      FlowHelper.setVisited("PostquestionnaireStandard");
      const nextPage = await FlowHelper.getFlowPage();
      if (nextPage) {
        navigate(`/${nextPage}`, { replace: true });
      } else {
        navigate("/home"); // Fallback navigation
      }
    } catch (error) {
      console.error("Fehler:", error);
      alert("Fehler beim Speichern der Daten. Bitte erneut versuchen.");
    }
  };

  const questions = [
    { key: "frequent_use", text: "Ich würde diese Mauseinstellung häufig nutzen." },
    { key: "complexity", text: "Ich fand die Komplexität der Mauseinstellung angemessen." },
    { key: "easy_to_use", text: "Ich fand die Mauseinstellung einfach zu benutzen" },
    { key: "tech_support", text: "Ich denke, dass ich die Mauseinstellung ohne die ohne Unterstützung einer technisch versierten Person (Person mit technischem Hintergrund) nutzen könnte." },
    { key: "functions_integrated", text: "Ich fand, die verschiedenen Funktionen der Mauseinstellung ware gut integriert." },
    { key: "everything_fits", text: "Ich denke, bei dieser Mauseinstellung passt alles zusammen." },
    { key: "quick_learning", text: "Ich kann mir vorstellen, dass die meisten Menschen den Umgang mit dieser Mauseinstellung sehr schnell lernen." },
    { key: "intuitive", text: "Ich fand die Benutzung der Mauseinstellung intuitiv versändlich." },
    { key: "felt_secure", text: "Ich fühlte mich bei der Benutzung der Mauseinstellung sehr sicher." },
    { key: "little_learning", text: "Ich konnte, ohne viel zu lernen, mit der Benutzung der Mauseinstellung beginnen." },
  ];

  // NASA TLX popup
  const NasaTlxModal = () => {
    if (!showTlxModal) return null;
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'rgb(102, 106, 158)',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          width: '300px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 15px', color: 'white' }}>Bitte füllen sie den von der Versuchsperson zu Verfügung gestellten Nasa TLX fragebogen aus.</h3>
          <button
            onClick={() => setShowTlxModal(false)}
            style={{
              padding: '8px 20px',
              fontSize: '16px',
              cursor: 'default',
              backgroundColor: 'rgba(25, 45, 95, 0.7)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
            }}
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  // Custom CSS styles to ensure scrollbar is always visible
  const scrollbarStyles = `
    .always-visible-scrollbar {
      overflow-y: scroll !important;
      scrollbar-width: thin; /* For Firefox */
      scrollbar-color: rgba(155, 155, 155, 0.7) transparent; /* For Firefox */
    }
    
    .always-visible-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    
    .always-visible-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    .always-visible-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(155, 155, 155, 0.7);
      border-radius: 4px;
    }
    
    .always-visible-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: rgba(125, 125, 125, 0.8);
    }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <NasaTlxModal />
      <div className="always-visible-scrollbar" style={{ height: "80vh", padding: "50px", border: "1px solid #ccc", textAlign: "center" }}>
        <h2 className="text-3xl font-bold mb-8">Fragebogen zur Mauseinstellung</h2>
        
        {questions.map(({ key, text }) => (
          <div key={key} className="scale-container mb-12">
            <h3 className="text-2xl font-bold mb-6">{text}</h3>
            <h4 className="mb-6 text-center w-full">1 = Stimme überhaupt nicht zu, 5 = Stimme vollständig zu</h4>
            <div className="small-container">
              <div className="horizontal-scale">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num} className="flex flex-col items-center cursor-default">
                    <input
                      type="radio"
                      name={key}
                      value={num}
                      checked={responses[key] === num}
                      onChange={() => setResponses({ ...responses, [key]: num })} // Store as number
                      className="hidden"
                    />
                    <span
                      className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${
                        responses[key] === num ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-400'
                      }`}
                    >
                      {num}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleSave}
          className="mt-6 px-8 py-3 bg-purple-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-purple-700 transition"
        >
          Weiter
        </button>
      </div>
    </>
  );
};

export default PostQuestionnaireStandard;