const db = require("../config/db");

exports.createPostQuestionnaireResult = (req, res) => {
  const {
    proband_id,
    maus_typ,
    frequent_use,
    complexity,
    easy_to_use,
    tech_support,
    functions_integrated,
    everything_fits,
    quick_learning,
    intuitive,
    felt_secure,
    little_learning
  } = req.body;

  if (
    !proband_id ||
    !maus_typ ||
    !frequent_use ||
    !complexity ||
    !easy_to_use ||
    !tech_support ||
    !functions_integrated ||
    !everything_fits ||
    !quick_learning ||
    !intuitive ||
    !felt_secure ||
    !little_learning
  ) {
    return res.status(400).json({ error: "All necessary fields are required" });
  }

  console.log("New post-Questionnaire:", req.body);

  const query = `
    INSERT INTO post_questionnaire_results (
      proband_id, maus_typ, frequent_use, complexity, easy_to_use,
      tech_support, functions_integrated, everything_fits, quick_learning, 
      intuitive, felt_secure, little_learning, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    query,
    [
      proband_id,
      maus_typ,
      frequent_use,
      complexity,
      easy_to_use,
      tech_support,
      functions_integrated,
      everything_fits,
      quick_learning,
      intuitive,
      felt_secure,
      little_learning
    ],
    (err, result) => {
      if (err) {
        console.error("Error saving the post-questionnaire", err);
        return res.status(500).json({ error: "Error saving the post-questionnaire" });
      }

      res.status(201).json({ message: "Post-questionnaire saved successfully", result });
    }
  );
};