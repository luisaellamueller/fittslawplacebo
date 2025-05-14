const db = require("../config/db");

exports.createFittsExperimentResults = async (req, res) => {
  const results = req.body;
  if (!Array.isArray(results) || results.length === 0) {
    return res.status(400).json({ error: "Invalid datastructure" });
  }
  
  console.log("Several results:", results);
  
  const query = `
    INSERT INTO fitts_experiment_results
    (UserID, MausTyp, TargetID, DifficultyIndex, MT, ClickX, ClickY, TargetX, Width, Distance, Error, Level, created_at)
    VALUES ${results.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())").join(", ")}
  `;
  
  const values = results.flatMap(({
    UserID, MausTyp, TargetID, DifficultyIndex, MT, ClickX, ClickY, TargetX, Width, Distance, Error, Level
  }) => [
    UserID, MausTyp, TargetID, DifficultyIndex, MT, ClickX, ClickY, TargetX, Width, Distance, Error, Level
  ]);
  
  try {
    const [result] = await db.promise().execute(query, values);
    res.status(201).json({
      message: "Fitts' Law experiment results saved successfully",
      result
    });
  } catch (err) {
    res.status(500).json({
      error: "Error saving the results",
    });
  }
};