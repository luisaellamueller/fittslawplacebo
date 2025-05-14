const express = require("express");
const router = express.Router();
const { createPreQuestionnaireResult } = require("../controllers/preQuestionnaireController");
// POST route for creating a new pre-questionnaire result
router.post("/", createPreQuestionnaireResult);

module.exports = router;
