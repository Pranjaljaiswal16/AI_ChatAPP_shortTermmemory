
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");

const JWT_SECRET = process.env.JWT_SECRET || "framewise-dev-secret";

async function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userModel.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please login again.",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token, Please Login Again.",
    });
  }
}


module.exports = authMiddleware
