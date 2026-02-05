const db = require("./config/db");
const { hashPassword, comparePassword } = require("./utils/passwordUtils");
const { generateToken, verifyToken } = require("./utils/jwtUtils");

async function testAuth() {
  try {
    console.log("---1. Registering User ---");

    // making random users so we don't get duplicate key
    const randomNum = Math.floor(Math.random() * 1000);
    const username = `User${randomNum}`;
    const email = `user${randomNum}@test.com`;
    const plainPassword = "password123";

    // Hash it
    const hashedPassword = await hashPassword(plainPassword);

    // Save to db
    const res = await db.query(
      "insert into users (username, email, password) values ($1, $2, $3) returning *",
      [username, email, hashedPassword],
    );
    user = res.rows[0];
    console.log("user saved to DB:", user);

    console.log(" \n--- login (day 1) ---");
    const isMatch = await comparePassword(plainPassword, user.password);

    if (!isMatch) {
      throw new Error("wrong password!");
    }
    console.log("password verified.");

    console.log("--- issue jwt(day 2) ---");
    const token = generateToken(user);
    console.log("jwt generated:");
    console.log(token);

    // simulate the user coming back later with the token
    try {
      const decoded = verifyToken(token);
      console.log("token is valid! user data inside:");
      console.log(decoded);
      
    } catch (error) {
      console.log("token rejected:", error.message);
    }
  } catch (error) {
    console.error("error:", error.message);
  }
}

testAuth();
