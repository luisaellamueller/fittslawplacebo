const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const probandsRoutes = require("./routes/probands");
const randomizeRoutes = require("./routes/randomize");
const preQuestionnaireRoutes = require("./routes/PreQuestionnaireResult");
const postQuestionnaireRoutes = require("./routes/postQuestionnaireResult");
const storeRoutes = require("./routes/storeroute");
const fittsTaskRoutes = require("./routes/fittsTask");

// Database Connection
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use("/api/probands", probandsRoutes);
app.use("/api/randomize", randomizeRoutes);
app.use("/api/pre-questionnaire", preQuestionnaireRoutes);
app.use("/api/post-questionnaire", postQuestionnaireRoutes); 
app.use("/api/fitts-task", fittsTaskRoutes);
app.use("/api/flow", storeRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
