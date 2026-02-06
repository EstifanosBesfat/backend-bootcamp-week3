const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");
const { port } = require("./config");

require("dotenv").config();

const app = express();

// middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Professional server running on port ${PORT}`);
});
