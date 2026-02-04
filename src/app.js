const db = require("./config/db");
const { hashPassword, comparePassword } = require("./utils/passwordUtils");

async function testAuth() {
  try {
    console.log("---1. Registering User ---");
    const username = "SecureSteve";
    const plainTextPassword = "mySuperSecretPassword123";

    // Hash it
    console.log(`Original: ${plainTextPassword}`);
    const hashedPassword = await hashPassword(plainTextPassword);
    console.log(`Hashed: ${hashedPassword}`);

    // Save to db
    const res = await db.query(
      "insert into users (username, email, password) values ($1, $2, $3) returning *",
      [username, "steve@test.com", hashedPassword],
    );
    console.log("user saved to DB:", res.rows[0]);

    // verifying user (fake login)
    console.log("\n--- fake login ---");

    // pretend we fetched user from db
    const userFromDb = res.rows[0];

    // compare wrong password
    const isMatchBad = await comparePassword(
      "wrongPassword",
      userFromDb.password,
    );
    console.log(`${isMatchBad ? "login successfully" : "login failed"}`);
  } catch (error) {
    console.error("error:", error.message);
  }
}

testAuth();
