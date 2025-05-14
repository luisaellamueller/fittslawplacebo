import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// zentrale CSS-Datei
import "./styles/index.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <App />
);
