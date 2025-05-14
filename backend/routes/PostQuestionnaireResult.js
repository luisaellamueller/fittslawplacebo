const express = require("express");
const router = express.Router();
const { createPostQuestionnaireResult } = require("../controllers/postQuestionnaireController"); 

router.post("/", createPostQuestionnaireResult);

module.exports = router;
