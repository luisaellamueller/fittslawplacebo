const Proband = require("../models/probandModel");
let latestProbandId = null; // Variable to store the latest Proband ID

exports.createProband = (req, res) => {
  const { vorname, nachname, geburtsdatum, technischer_studiengang, stufe, gender, self_described_gender } = req.body;
  
  if (!vorname || !nachname || !geburtsdatum) {
    return res.status(400).json({ error: "All required fields must be provided" });
  }
  
  Proband.create({
    vorname,
    nachname,
    geburtsdatum,
    technischer_studiengang,
    stufe,
    gender,
    self_described_gender
  }, (err, result) => {
    if (err) {
      console.error("Error saving the proband:", err);
      return res.status(500).json({ error: "Error saving the proband" });
    }
    
    // Retrieve and store the latest ID after saving
    Proband.findByDetails(vorname, nachname, geburtsdatum, (err, proband) => {
      if (err) {
        console.error("Error retrievign the id:", err);
        return res.status(500).json({ error: "Error retrieving the proband ID" });
      }
      
      if (!proband) {
        return res.status(404).json({ error: "Proband not found" });
      }
      
      latestProbandId = proband.id; // Store the latest ID globally
      res.status(201).json({ message: "Proband successfully created", id: latestProbandId });
    });
  });
};

// Endpoint to get the latest stored Proband ID
exports.getProbandId = (req, res) => {
  if (!latestProbandId) {
    return res.status(404).json({ error: "No proband ID found" });
  }
  res.json({ id: latestProbandId });
};

// Function for updating technical background
exports.updateProbandBackground = (req, res) => {
  const { technischer_studiengang } = req.body;
  
  if (!latestProbandId) {
    return res.status(400).json({ error: "No valid proband ID found" });
  }
  
  Proband.updateBackground(latestProbandId, technischer_studiengang, (err, result) => {
    if (err) {
      console.error("Error updating technical background:", err);
      return res.status(500).json({ error: "Error saving" });
    }
    res.json({ message: "Technical background successfully updated" });
  });
};

// Function for updating gender information
exports.updateProbandGender = (req, res) => {
  const { gender, self_described_gender } = req.body;
  
  if (!latestProbandId) {
    return res.status(400).json({ error: "No valid proband ID found" });
  }
  
  Proband.updateGender(latestProbandId, gender, self_described_gender, (err, result) => {
    if (err) {
      console.error("Error updating gender information:", err);
      return res.status(500).json({ error: "Error saving" });
    }
    res.json({ message: "Gender information successfully updated" });
  });
};

// Updating data quality information
exports.updateProbandDataQuality = (req, res) => {
  const { use_data, data_quality_reason } = req.body;
  
  if (!latestProbandId) {
    return res.status(400).json({ error: "No valid proband ID found" });
  }
  
  Proband.updateDataQuality(latestProbandId, use_data, data_quality_reason, (err, result) => {
    if (err) {
      console.error("Error updating data quality information:", err);
      return res.status(500).json({ error: "Error saving" });
    }
    res.json({ message: "Data quality information successfully updated" });
  });
};