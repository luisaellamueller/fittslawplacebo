const db = require("../config/db");

exports.createPreQuestionnaireResult = (req, res) => {
  const { proband_id, maus_typ, erwartete_performance } = req.body;

  if (!proband_id || !maus_typ || erwartete_performance === undefined) {
    return res.status(400).json({ error: "All necessary fields are required" });
  }

  console.log("New Pre-Questionnaire:", req.body);

  const query = `
    INSERT INTO pre_questionnaire_results (proband_id, maus_typ, erwartete_performance, created_at)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(query, [proband_id, maus_typ, erwartete_performance], (err, result) => {
    if (err) {
      console.error("Error saving the pre-questionnaire", err);
      return res.status(500).json({ error: "Error saving the pre-questionnaire" });
    }

    res.status(201).json({ message: "Pre-questionnaire saved successfully", result });
  });
};
