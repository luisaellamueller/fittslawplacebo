const express = require("express");
const router = express.Router();

// Function to generate a random order ID (1 to 6)
const getRandomOrderId = () => {
  const orderId = Math.floor(Math.random() * 6) + 1;
  console.log("Generated Order ID:", orderId); // Debugging log
  return orderId;
};

// API endpoint to return a randomized order ID
router.get("/", (req, res) => {
  const orderId = getRandomOrderId();
  console.log("Sending response with orderId:", orderId); // Another debugging log
  res.json({ orderId });
});

module.exports = router;
