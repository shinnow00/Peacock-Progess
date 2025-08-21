const express = require("express");
const { put } = require("@vercel/blob");
const { createCard, getCards } = require("../controllers/card.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

router.post(
  "/cards",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const filename = req.headers["x-vercel-filename"] || "image.png";

      // 1. Upload the file to Vercel Blob
      const blob = await put(filename, req.body, {
        access: "public",
        // You might need to set the Content-Type header if it's not automatically detected
        // contentType: req.headers['content-type'],
      });

      // 2. Call your controller with the blob URL
      // The controller needs to be adapted to receive the URL instead of a file object.
      const cardData = {
        // Assuming other card data is sent as query parameters or headers
        // as the body is now the raw file.
        // A better approach is to use a library like `busboy` to parse multipart forms in memory.
        title: req.headers["x-card-title"] || "Untitled",
        description: req.headers["x-card-description"] || "",
        imageUrl: blob.url, // Pass the public URL to your controller
      };

      // This is a simplified call. You'll need to adapt your controller.
      // For now, let's just return the blob URL.
      res
        .status(200)
        .json({ message: "File uploaded successfully", url: blob.url });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ message: "Failed to upload file." });
    }
  }
);

// both "user" and "admin" can view
router.get("/", authMiddleware, getCards);
module.exports = router;
