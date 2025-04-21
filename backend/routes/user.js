const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { User, Account } = require('../db');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require('../middleware');

// Zod schemas
const signupBody = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string()
});

const signinBody = z.object({
    username: z.string().email(),
    password: z.string()
});

const updateBody = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
});

// SIGNUP
router.post("/signup", async (req, res) => {
    console.log("Signup payload:", req.body);

    const parsed = signupBody.safeParse(req.body);
    if (!parsed.success) {
        return res.status(411).json({
            message: "Validation failed",
            issues: parsed.error.errors
        });
    }

    const { username, password, firstName, lastName } = parsed.data;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(411).json({ message: "Username already taken" });
    }

    const user = await User.create({ username, password, firstName, lastName });

    await Account.create({
        userId: user._id,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({ userID: user._id }, JWT_SECRET);
    res.json({
        message: "User created successfully",
        token
    });
});

// SIGNIN
router.post("/signin", async (req, res) => {
    const parsed = signinBody.safeParse(req.body);
    if (!parsed.success) {
        return res.status(411).json({
            message: "Incorrect inputs",
            issues: parsed.error.errors
        });
    }

    const { username, password } = parsed.data;

    const user = await User.findOne({ username, password });
    if (user) {
        const token = jwt.sign({ user: user._id }, JWT_SECRET);
        return res.status(200).json({ token });
    }

    res.status(411).json({ message: "Error while logging in" });
});

// UPDATE USER
router.put("/", authMiddleware, async (req, res) => {
    const parsed = updateBody.safeParse(req.body);
    if (!parsed.success) {
        return res.status(411).json({ message: "Error while updating the information" });
    }

    await User.updateOne({ _id: req.userID }, parsed.data);
    res.status(200).json({ message: "Update successfully" });
});

// BULK USER SEARCH
router.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.body.filter || "";

    const users = await User.find({
        $or: [
            { firstName: { $regex: filter, $options: 'i' } },
            { lastName: { $regex: filter, $options: 'i' } }
        ]
    });

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

module.exports = router;
