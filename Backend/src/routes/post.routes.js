const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const { createPostController } = require("../controllers/post.controller.js");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed"));
    }

    return callback(null, true);
  },
});

router.post("/", authMiddleware, upload.single("image"), createPostController);

module.exports = router;
