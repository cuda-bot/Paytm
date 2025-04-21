const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const mongoose = require('mongoose');

// GET Balance
router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userID });
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.status(200).json({ balance: account.balance });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// POST Transfer
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { amount, to } = req.body;

        // Validate input
        if (!amount || !to  || amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid input for transfer" });
        }

        const sender = await Account.findOne({ userId: req.userID }).session(session);
        if (!sender || sender.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance or invalid sender" });
        }

        const receiver = await Account.findOne({ userId: to }).session(session);
        if (!receiver) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Receiver not found" });
        }

        // Perform balance update
        await Account.updateOne(
            { userId: req.userID },
            { $inc: { balance: -amount } }
        ).session(session);

        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } }
        ).session(session);

        await session.commitTransaction();
        res.status(200).json({ message: "Transfer successful" });

    } catch (err) {
        await session.abortTransaction();
        console.error("Transfer error:", err);
        res.status(500).json({ message: "Transfer failed", error: err.message });
    } finally {
        session.endSession();
    }
});

module.exports = router;
