import Card from "../models/Card.js";
import { createCardSchema } from "../Validators/cardValidator.js";

// Get all cards
export async function getCards(req, res) {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get a single card by ID
export async function getCard(req, res) {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get cards by category
export async function getByCategory(req, res) {
  try {
    const category = req.params.category;
    const cards = await Card.find({ category });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Create a new card with validation
export async function createCard(req, res) {
  try {
    // Validate the incoming request
    const validatedData = createCardSchema.parse(req.body);

    // Save to DB
    const newCard = new Card(validatedData);
    const savedCard = await newCard.save();

    res.status(201).json(savedCard);
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
  }
}
