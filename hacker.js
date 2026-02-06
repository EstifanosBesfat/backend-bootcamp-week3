const jwt = require("jsonwebtoken");

// hacker's secret ( they don't know your real .env secret)

const HACKER_SECRET = "i_am_guessing_the_key";

//the payload (they want to be admin)
const fakePayload = {
  id: 100,
  username: "HackerSteave",
  role: "admin",
};

const fakeToken = jwt.sign(fakePayload, HACKER_SECRET, {expiresIn: '1h'});

console.log(" forged token generated:");
console.log(fakeToken);
console.log("\ntry using this token on GET /admin");