const errorHandler = (err, req, res, next) => {
  // default to 500 if unknown
  const statusCode = err.statusCode || 500;
  const message = err.message || "something went wrong";

  console.error(`Error : ${message}`);

  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      statusCode: statusCode,
    },
  });
};

module.exports = errorHandler;
