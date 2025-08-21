const Card = require("../models/card.model");

exports.createCard = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newCard = new Card({
      title,
      description,
      image: req.file ? req.file.filename : null
    });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ message: "Error creating card" });
  }
};

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cards" });
  }
};
