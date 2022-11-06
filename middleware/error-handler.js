exports.errorHandler = (error, req, res, next) => {
  let errorMessage = {};
  if (!error.status) {
    error.status = 500;
  }

  if (!error.message) {
    error.message = "Server Error";
  }
  errorMessage = { error: error.message };

  if (error.detail) {
    errorMessage = { ...errorMessage, errorDetail: error.detail };
  }

  res.status(error.status).json({
    message: errorMessage,
  });
};
