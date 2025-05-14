const db = require("../config/db");

const Proband = {
  create: (data, callback) => {
    const query =
      "INSERT INTO probands (vorname, nachname, geburtsdatum, technischer_studiengang, stufe, gender, self_described_gender) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [data.vorname, data.nachname, data.geburtsdatum, data.technischer_studiengang, data.stufe, data.gender, data.self_described_gender],
      callback
    );
  },
  
  findByDetails: (vorname, nachname, geburtsdatum, callback) => {
    const query = "SELECT id FROM probands WHERE vorname = ? AND nachname = ? AND geburtsdatum = ? LIMIT 1";
    db.query(query, [vorname, nachname, geburtsdatum], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results.length > 0 ? results[0] : null);
    });
  },
  
  updateBackground: (id, technischer_studiengang, callback) => {
    const query = "UPDATE probands SET technischer_studiengang = ? WHERE id = ?";
    db.query(query, [technischer_studiengang, id], callback);
  },
  
  updateGender: (id, gender, self_described_gender, callback) => {
    const query = "UPDATE probands SET gender = ?, self_described_gender = ? WHERE id = ?";
    db.query(query, [gender, self_described_gender, id], callback);
  },
  
  updateDataQuality: (id, use_data, data_quality_reason, callback) => {
    const query = "UPDATE probands SET use_data = ?, data_quality_reason = ? WHERE id = ?";
    db.query(query, [use_data, data_quality_reason, id], callback);
  },
};

module.exports = Proband;