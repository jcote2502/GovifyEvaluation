const express = require("express");
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require("../models");
const { Admins } = db;
const { ensureAuthenticated, sendTokenResponse, hashPassword } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");


// Define rate limit: maximum 5 requests per 15 minutes
const signupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        msg: "Too many signup attempts from this IP, please try again after 15 minutes",
    },
});

// Signup route
router.post("/signup", signupLimiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admins.create({
            email: email,
            password: hashPassword(password)
        });
        sendTokenResponse(admin, res);
    } catch (error) {
        res.status(400).json({ msg: "Failed Signup", error });
    }
});

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admins.findOne({ where: { email } });

        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            console.log(bcrypt.compareSync(password, admin.password))
            return res.status(401).json({ msg: "Invalid credentials" });
        }
        sendTokenResponse(admin, res);
    } catch (error) {
        console.error("Login Error: ", error);
        res.status(500).json({ msg: "Login failed", error });
    }
});

// gets admin with stored token
router.get("/user/:token", ensureAuthenticated, async (req, res) => {
    const {token} = req.params;
    try {
        const admin = await Admins.findOne({where:{token}});
        if (!admin) {
            return res.status(404).json({ msg: "Admin not found" });
        }
        res.json({ admin });
    } catch (error) {
        console.error("Fetch Admin Error: ", error);
        res.status(500).json({ msg: "Failed to fetch admin", error });
    }
});

// Logout 
router.post("/logout", ensureAuthenticated, (req, res) => {
    res.json({ msg: "Successfully logged out" });
});
module.exports = router;
