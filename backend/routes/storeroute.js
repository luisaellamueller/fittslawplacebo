const express = require("express");
const router = express.Router();

let nextFlow = "default";
let flowPage = "default";
let visited = []; // Array to store visited flow names
 
// Endpoint to set the flow page (For example: Flow1)
router.post("/setFlowPage", (req, res) => {
    const { flow } = req.body;
    if (!flow) {
      return res.status(400).json({ error: "Flow Page is required" });
    }
    flowPage = flow;
    res.json({ message: "Flow Page set sucessfully", nextFlow });
  });

// Endpoint to get the next flow
router.get("/getFlowPage", (req, res) => {
    res.json({ flowPage });
  });

// Endpoint to set the next flow
router.post("/setNextFlow", (req, res) => {
  const { flow } = req.body;
  if (!flow) {
    return res.status(400).json({ error: "Flow name is required" });
  }
  nextFlow = flow;
  res.json({ message: "Next flow updated successfully", nextFlow });
});

// Endpoint to get the next flow
router.get("/getNextFlow", (req, res) => {
  res.json({ nextFlow });
});

// Endpoint to add a flow name to the array
router.post("/setVisited", (req, res) => {
  const { flow } = req.body;
  if (!flow) {
    return res.status(400).json({ error: "Flow name is required" });
  }
  visited.push(flow);
  res.json({ message: "Flow name added successfully", visited });
});

// Endpoint to check if a flow name exists in the array
router.post("/checkVisited", (req, res) => {
  const { flow } = req.body;
  if (!flow) {
    return res.status(400).json({ error: "Flow name is required" });
  }
  const exists = visited.includes(flow);
  res.json({ exists });
});

// Endpoint to receive the size of the visited array
router.get("/getVisitedSize", (req, res) => {
  res.json({ visitedSize: visited.length });
});

// Endpoint to clear all visited flow entries
router.post("/clearVisited", (req, res) => {
  visited = [];
  res.json({ 
    message: "Visited flows cleared successfully", 
    visitedSize: visited.length 
  });
});

module.exports = router;