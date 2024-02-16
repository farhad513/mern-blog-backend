const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Internal Server Error";
  res.status(statusCode).send({
    success: false,
    statusCode,
    errorMessage,
  });
};

module.exports = errorMiddleware;
