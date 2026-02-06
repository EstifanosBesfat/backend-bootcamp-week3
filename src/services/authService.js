const userRepository = require("../repositories/userRepository");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const { generateToken } = require("../utils/jwtUtils");
const AppError = require("../utils/AppError");

// REGISTER LOGIC
const registerUser = async (username, email, plainPassword) => {
  // 1. Check existence
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  // 2. Hash
  const hashedPassword = await hashPassword(plainPassword);

  // 3. Create
  const newUser = await userRepository.createUser({
    username,
    email,
    password: hashedPassword,
  });

  return newUser;
};

// LOGIN LOGIC
const loginUser = async (email, password) => {
  // 1. Check User
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // 2. Check Password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  // 3. Generate Token
  const token = generateToken(user);
  return { user, token };
};

module.exports = { registerUser, loginUser };
