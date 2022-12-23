// environment variable
require("dotenv").config();

// handling  async errors
require("express-async-errors");

// security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

// required packages
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// local imports
const connectDB = require("./db/connectDB");
const placesRouter = require("./router/places-routes");
const usersRouter = require("./router/users-routes");
const routeNotFoundMiddleware = require("./middleware/route-not-found-middleware");
const errorHandlingMiddleware = require("./middleware/error-handler-middleware");

const app = express();

// handling static files
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// package middleware
app.use(bodyParser.json());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(xss());

// Route Middlewares
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/places", placesRouter);

// error handling middleware
app.use(routeNotFoundMiddleware);
app.use(errorHandlingMiddleware);

// starting server
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
