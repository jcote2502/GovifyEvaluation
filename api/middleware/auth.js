const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const { Admins } = db;
// This will create a secure random key
const crypto = require("crypto");
const secret = crypto.randomBytes(32).toString("hex");

module.exports = {
    // Function to generate a token
    generateToken: (admin) => {
        const payload = {
            ID: admin.ID,
            email: admin.email,
        };
        return jwt.sign(payload, secret, { expiresIn: '1h' }); // Token valid for 1 hour
    },

    // Function to hash password
    hashPassword: (password) => {
        return bcrypt.hashSync(password, 10);
    },

    // Middleware to ensure the user is logged in and has a valid token
    ensureAuthenticated: (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.sendStatus(401); 
        }

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.sendStatus(401); 
            }

            req.admin = decoded;
            next();
        });
    },

    sendTokenResponse: async (admin, res) => {
        try {
            const token = module.exports.generateToken(admin);

            // Save the token to the database
            const user = await Admins.findByPk(admin.ID);

            if (!user){
                return res.status(500).json({message:'Error fetching User',error})
            }

            user.token = token || null;

            await user.save();

            res.status(200).json({
                admin: {
                    ID: admin.ID,
                    email: admin.email,
                },
                token,
            });
        } catch (error) {
            console.error("Error saving token to the database:", error);
            res.status(500).json({ message: "Error saving token", error });
        }
    }
};
