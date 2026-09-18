const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "framewise-dev-secret";

const normalizeUserForResponse = (user) => ({
  username: user.username,
  id: user._id,
});

const registerController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const user = await userModel.create({
      username,
      password: await bcrypt.hash(password, 10),
    });
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(201).json({
      message: "User created successfully",
      user: normalizeUserForResponse(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    return res.status(500).json({
      message: "Unable to create user",
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({
      username,
    });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      message: "Login Successfully",
      user: normalizeUserForResponse(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    return res.status(500).json({
      message: "Unable to create user",
    });
  }
};

module.exports = { registerController, loginController, normalizeUserForResponse };
