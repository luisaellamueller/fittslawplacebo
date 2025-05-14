import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vorname: "",
    nachname: "",
    geburtsdatum: "",
    technischer_studiengang: false,
    stufe: "Bachelor",
  });

  const [confirmations, setConfirmations] = useState({
    noCardiovascularDisease: false,
    dataConsent: false,
    scientificUseConsent: false // NEU
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "technischer_studiengang") {
      setFormData({ ...formData, [name]: value === "true" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleConfirmationChange = (e) => {
    const { name, checked } = e.target;
    setConfirmations({ ...confirmations, [name]: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !confirmations.noCardiovascularDisease ||
      !confirmations.dataConsent ||
      !confirmations.scientificUseConsent // NEU
    ) {
      alert("Bitte akzeptieren Sie alle drei Bestätigungen, um fortzufahren.");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/probands", formData);
      alert("Erfolgreich gespeichert.");
      setFormData({
        vorname: "",
        nachname: "",
        geburtsdatum: "",
        technischer_studiengang: false,
        stufe: "Bachelor",
      });
      navigate("/studyinformation");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data. Check the console for more details.");
    }
  };

  return (
    <div className="wide-container">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Probandenformular</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="vorname"
            placeholder="Vorname"
            value={formData.vorname}
            onChange={handleChange}
            className="w-[85%] p-2 border border-gray-300 rounded mx-auto block"
            style={{
              backgroundColor: "rgba(94, 93, 112, 0.6)",
              border: "none",
              borderRadius: "10px",
              height: "40px",
              width: "92%",
            }}
            required
          />
          <input
            type="text"
            name="nachname"
            placeholder="Nachname"
            value={formData.nachname}
            onChange={handleChange}
            className="w-[85%] p-2 border border-gray-300 rounded mx-auto block"
            style={{
              backgroundColor: "rgba(94, 93, 112, 0.6)",
              border: "none",
              borderRadius: "10px",
              height: "40px",
              width: "92%",
            }}
            required
          />
          <input
            type="date"
            name="geburtsdatum"
            value={formData.geburtsdatum}
            onChange={handleChange}
            className="w-[85%] p-2 border border-gray-300 rounded mx-auto block"
            style={{
              backgroundColor: "rgba(94, 93, 112, 0.6)",
              border: "none",
              borderRadius: "10px",
              height: "40px",
              width: "92%",
            }}
            required
          />

          <label className="block">
            Stufe:
            <select
              name="stufe"
              value={formData.stufe}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
            </select>
          </label>

          {/* Checkbox 1: Keine kardiovaskulären Erkrankungen */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="noCardiovascularDisease"
              id="noCardiovascularDisease"
              checked={confirmations.noCardiovascularDisease}
              onChange={handleConfirmationChange}
              className="h-4 w-4"
              required
            />
            <label htmlFor="noCardiovascularDisease" className="text-sm">
              Ich bestätige hiermit, dass ich keine kardiovaskulären Erkrankungen habe.
            </label>
          </div>

          {/* Checkbox 2: Datenweitergabe an Nixtla */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="dataConsent"
              id="dataConsent"
              checked={confirmations.dataConsent}
              onChange={handleConfirmationChange}
              className="h-4 w-4"
              required
            />
            <label htmlFor="dataConsent" className="text-sm">
              Ich stimme zu, dass meine Daten an Nixtla weitergegeben werden dürfen.
              Diese werden im Rahmen der Studie beim Verwenden der TimeGPT API anonymisiert an Nixtla weitergegeben.
            </label>
          </div>

          {/* ✅ NEUE Checkbox: Zustimmung zur wissenschaftlichen Nutzung */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="scientificUseConsent"
              id="scientificUseConsent"
              checked={confirmations.scientificUseConsent}
              onChange={handleConfirmationChange}
              className="h-4 w-4"
              required
            />
            <label htmlFor="scientificUseConsent" className="text-sm">
              Ich stimme zu, dass meine Daten im Rahmen dieser Studie zu wissenschaftlichen Zwecken verwendet werden dürfen.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Speichern
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
