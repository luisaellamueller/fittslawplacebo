import { useState, useEffect } from "react";
import { Form, useNavigate } from "react-router-dom";
import axios from "axios";
import FlowHelper from "../utility/FlowHelper";

const PrequestionnaireML = () => {
  const [performance, setPerformance] = useState(4);
  const [probandId, setProbandId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProbandId = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/probands/currentuserid");
        if (response.data?.id) {
          setProbandId(response.data.id);
          localStorage.setItem("probandId", response.data.id);
        } else {
          throw new Error("Keine Proband-ID gefunden.");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Proband-ID:", error);
        const storedId = localStorage.getItem("probandId");
        if (storedId) {
          setProbandId(storedId);
        } else {
          alert("Fehler: Proband ID fehlt! Kehre zur Startseite zurück.");
          navigate("/");
        }
      }
    };

    fetchProbandId();
  }, [navigate]);

  const handleSave = async () => {
    if (!probandId) {
      alert("Fehler: Proband ID fehlt!");
      return;
    }

    const data = {
      proband_id: probandId,
      maus_typ: "ML",
      erwartete_performance: performance,
    };

    try {
      await axios.post("http://localhost:5001/api/pre-questionnaire", data);
      alert("Erfolgreich gespeichert.");
      FlowHelper.setVisited("PrequestionnaireML"); // Set the page as visited

      // Get the stored flow page from FlowHelper
      const nextPage = await FlowHelper.getFlowPage();
      if (nextPage) {
        navigate(`/${nextPage}`); // Navigate to the returned page
      } else {
        navigate("/home"); // Fallback navigation
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern der Daten.");
    }
  };

  return (
    <div className="scale-container">
      <h3 className="text-2xl font-bold mb-6">Sie testen nun die ML-unterstützte Mausführung. Sie erhalten im Anschluss weitere Informationen und technische Details. Wie erwarten Sie Ihre Performance im Gegensatz zu den anderen Mauseinstellungen?</h3>
      <h3 className="mb-6 text-center w-full">1 = Schlechter, 7 = Besser</h3>
      <div className="small-container">
        <div className="horizontal-scale">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <label key={num} className="flex flex-col items-center cursor-default">
              <input
                type="radio"
                name="performance"
                value={num}
                checked={performance === num}
                onChange={() => setPerformance(num)}
                className="hidden"
              />
              <span className="text-sm text-gray-300 mt-2">{num}</span>
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={handleSave}
        className="mt-6 px-8 py-3 bg-purple-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-purple-700 transition"
      >
        Weiter
      </button>
    </div>
  );
};

export default PrequestionnaireML;
