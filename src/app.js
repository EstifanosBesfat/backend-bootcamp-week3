require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./config/db");
const {
  hashPassword,
  comparePassword,
} = require("./utils/passwordUtils");
const { generateToken } = require("./utils/jwtUtils");
const authenticateToken = require("./middlewares/authMiddlewere");
const authorizeRoles = require("./middlewares/roleMiddleware");
const {
  validateRegister,
  validateLogin,
} = require("./middlewares/validationMiddleware");
// Middleware to parse JSON bodies
app.use(express.json());

app.post("/register", validateRegister, async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const check = await db.query("select * from users where email = $1", [
      email,
    ]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: "user already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const result = await db.query(
      "insert into users (username, email, password) values ($1, $2, $3) returning id, username, email, role",
      [username, email, hashedPassword],
    );
    res.status(201).json({ message: "user registered", user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTE 1: LOGIN (Public) ---
app.post("/login",validateLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user in DB
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
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
app.get("/profile", authenticateToken, (req, res) => {
  // If we get here, the token is valid.
  // We can access req.user because the middleware attached it.
  res.json({
    message: "Welcome to the VIP area",
    user: req.user, // This comes from the token!
  });
});

//---ROUTE 3: admin panel (protected + Admin Only) ---
// 1. authenticateToken (check who they are) -> adds req.user
// 2. authorizeRoles('admin') (check permission) -> cheks req.user. role
app.get("/admin", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Welcome, admin. You have supreme power.",
    secretData: "The launch codes are 1234",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
