const { StatusCodes } = require("http-status-codes");
const fs = require("fs");

const errorHandlingMiddleware = (error, req, res, next) => {
  // rollback changes in file if we are encountering any error
  if (req.file) {
    fs.unlink(req.file.path, (error) => {
      console.log(error);
    });
  }

  let customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || "Something went wrong try again later",
  };

  if (error.name === "ValidationError") {
    if ("email" in error.errors && error.errors.email.kind === "unique") {
      customError.message = `User with email: ${error.errors.email.value} already exists`;
    }

    if ("password" in error.errors) {
      customError.message = Object.values(error.errors)
        .map((item) => item.message)
        .join(",");
    }
    customError.statusCode = 400;
  }

  return res.status(customError.statusCode).json({ message: customError.message });
};

module.exports = errorHandlingMiddleware;
