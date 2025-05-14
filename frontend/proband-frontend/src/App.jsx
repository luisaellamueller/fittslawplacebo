import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StudyInformation from "./pages/Studyinformation";
import PrequestionnaireStandard from "./pages/PrequestionnaireStandard";
import PrequestionnairePhysical from "./pages/PrequestionnairePhysical";
import PrequestionnaireML from "./pages/PrequestionnaireML";
import PostQuestionnaireStandard from "./pages/PostquestionnaireStandart";
import PostQuestionnairePhysical from "./pages/PostquestionnairePhysical";
import PostQuestionnaireML from "./pages/PostquestionnaireML";
import Flow1 from "./pages/Flow1";
import Flow2 from "./pages/Flow2";
import Flow3 from "./pages/Flow3";
import Flow4 from "./pages/Flow4";
import Flow5 from "./pages/Flow5";
import Flow6 from "./pages/Flow6";
import FittsTaskStandard from "./pages/FittsTaskStandard";
import FittsTaskPhysical from "./pages/FittsTaskPhysical";
import FittsTaskML from "./pages/FittsTaskML";
import FittsTaskTest from "./pages/FittsTaskTest";
import PlaceboReveal from "./pages/PlaceboReveal";
import End from "./pages/End";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Studyinformation" element={<StudyInformation />} />
        <Route path="/PrequestionnaireStandard" element={<PrequestionnaireStandard />} />
        <Route path="/PrequestionnairePhysical" element={<PrequestionnairePhysical />} />
        <Route path="/PrequestionnaireML" element={<PrequestionnaireML />} />
        <Route path="/PostquestionnaireStandard" element={<PostQuestionnaireStandard />} />
        <Route path="/PostquestionnairePhysical" element={<PostQuestionnairePhysical />} />
        <Route path="/PostquestionnaireML" element={<PostQuestionnaireML />} />
        <Route path="/FittsTaskStandard" element={<FittsTaskStandard />} />
        <Route path="/FittsTaskPhysical" element={<FittsTaskPhysical />} />
        <Route path="/FittsTaskML" element={<FittsTaskML />} />
        <Route path="/FittsTaskTest" element={<FittsTaskTest />} />
        <Route path="/PlaceboReveal" element={<PlaceboReveal />} />
        <Route path="/Flow1" element={<Flow1 />} />
        <Route path="/Flow2" element={<Flow2 />} />
        <Route path="/Flow3" element={<Flow3 />} />
        <Route path="/Flow4" element={<Flow4 />} />
        <Route path="/Flow5" element={<Flow5 />} />
        <Route path="/Flow6" element={<Flow6 />} />
        <Route path="/End" element={<End />} />
      </Routes>
    </Router>
  );
}

export default App;
