const db = require("../config/db");

const PreQuestionnaire = {
  create: (data, callback) => {
    const query = `
      INSERT INTO pre_questionnaire_results (proband_id, maus_typ, erwartete_performance, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    db.query(query, [data.proband_id, data.maus_typ, data.erwartete_performance], callback);
  },

  findByProbandId: (proband_id, callback) => {
    const query = `
      SELECT id FROM pre_questionnaire_results 
      WHERE proband_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    db.query(query, [proband_id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results.length > 0 ? results[0] : null);
    });
  },
};

module.exports = PreQuestionnaire;
