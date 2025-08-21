const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    images: [String] // ⬅️ array instead of single string
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
