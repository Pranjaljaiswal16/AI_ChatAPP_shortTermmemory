const express = require("express");
const { registerController, loginController } = require("../controllers/auth.controller");

const router = express.Router();

// POST REGISTER-API
router.post("/register", registerController);

// POST LOGIN-API
router.post("/login", loginController);

module.exports = router;
