require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const { hashPassword, comparePassword } = require('./utils/passwordUtils');
const { generateToken } = require('./utils/jwtUtils');
const authenticateToken = require('./middlewares/authMiddlewere');

// Middleware to parse JSON bodies
app.use(express.json());

// --- ROUTE 1: LOGIN (Public) ---
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user in DB
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];

        if (!user) return res.status(400).json({ error: "User not found" });

        // 2. Check Password
        const validPass = await comparePassword(password, user.password);
        if (!validPass) return res.status(400).json({ error: "Invalid password" });

        // 3. Generate Token
        const token = generateToken(user);
        res.json({ message: "Login Successful", token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ROUTE 2: PROFILE (Protected) ---
// Notice 'authenticateToken' is here!
app.get('/profile', authenticateToken, (req, res) => {
    // If we get here, the token is valid.
    // We can access req.user because the middleware attached it.
    res.json({ 
        message: "Welcome to the VIP area", 
        user: req.user // This comes from the token!
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});