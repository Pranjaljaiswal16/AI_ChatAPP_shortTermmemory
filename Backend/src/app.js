const express = require("express");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const projectRoot = path.resolve(__dirname, "../..");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://ai-chatapp-shortterm.onrender.com",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Frontend
app.use(express.static(path.join(projectRoot, "Frontend", "dist")));

// React/Vite routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.resolve(projectRoot, "Frontend", "dist", "index.html"));
});

module.exports = app;
