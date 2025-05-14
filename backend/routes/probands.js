const express = require("express");
const { 
  createProband,
  getProbandId,
  updateProbandBackground,
  updateProbandGender,
  updateProbandDataQuality
} = require("../controllers/probandsController");

const router = express.Router();

router.post("/", createProband);
router.get("/currentuserid", getProbandId);
router.post("/update-background", updateProbandBackground);
router.post('/update-gender', updateProbandGender);
router.post('/update-data-quality', updateProbandDataQuality);

module.exports = router;