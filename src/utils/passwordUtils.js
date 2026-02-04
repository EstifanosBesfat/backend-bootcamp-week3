const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

// function to turn plain passowrd into "$2b$10$..."
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// function to check if the plain password matches with encripted one
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword };
