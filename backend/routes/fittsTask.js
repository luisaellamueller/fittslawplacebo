const express = require("express");
const router = express.Router();
const { createFittsExperimentResults } = require("../controllers/fittsTaskController");

router.post("/", createFittsExperimentResults);

module.exports = router;
