require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  db: {
    user: process.env.DB_USER || "postgres", // Make sure these match your .env
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || 'week3_auth',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  },
  jwtSecret: process.env.JWT_SECRET,
};

// Validation: Crash app immediately if secrets are missing
if (!config.jwtSecret) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
}
if (!config.db.password) {
  throw new Error(" Fatal Error: DB_PASSWORD is missing in .env");
}

module.exports = config;
