const express = require("express");
const multer = require("multer");
const { createCard, getCards } = require("../controllers/card.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/requireRole");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  authMiddleware,
  requireRole("admin"), // ⬅️ admin-only creation
  upload.single("image"),
  createCard
);

router.get("/", authMiddleware, getCards); // both "user" and "admin" can view
module.exports = router;
