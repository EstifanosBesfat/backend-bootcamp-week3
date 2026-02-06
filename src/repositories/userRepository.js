const db = require('../config/db');

// DATA ACCESS LAYER (SQL ONLY)
const findByEmail = async (email) => {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
};

const createUser = async (userData) => {
    const { username, email, password, role } = userData;
    const result = await db.query(
        "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [username, email, password, role || 'user']
    );
    return result.rows[0];
};

module.exports = { findByEmail, createUser };