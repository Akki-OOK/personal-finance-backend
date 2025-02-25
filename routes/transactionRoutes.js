const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

// Add Transaction
router.post("/", auth, async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    const transaction = new Transaction({
      user: req.user.id, // Use the ID from the decoded token
      amount,
      type,
      category,
      description,
      date,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error("Error in /api/transactions POST route:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get Transactions by User
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
