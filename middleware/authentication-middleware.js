require("dotenv").config();
const UserModel = require("../model/users-schema");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/index");

const auth = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) throw new UnauthenticatedError("Aunthentication Failed");

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(payload.userID).select("-password");
    next();
  } catch (error) {
    throw new UnauthenticatedError("Aunthentication Failed");
  }
};

module.exports = auth;
