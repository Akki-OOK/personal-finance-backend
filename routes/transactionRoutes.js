const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

// Add Transaction
router.post("/", auth, async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    const transaction = new Transaction({
      user: req.user.id, // ID decoded from token
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

// Delete a transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await transaction.deleteOne();
    res.json({ message: "Transaction deleted" });
  } catch (err) {
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
