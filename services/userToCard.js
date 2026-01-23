import UserToCard from "../models/UserToCard.js";
import { updateUserCardSchema, getUserCardsSchema } from "../Validators/userToCardValidator.js";

// Get all cards for a user
export async function getUserCards(req, res) {
  try {
    const { userId } = getUserCardsSchema.parse(req.body);

    const completions = await UserToCard.find({ userId });
    res.status(200).json(completions);
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
  }
}

// Update status of a card for a user
export async function updateCardStatus(req, res) {
  try {
    const { userId, cardId, status } = updateUserCardSchema.parse(req.body);

    const result = await UserToCard.updateOne(
      { userId, cardId },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User-card relation not found" });
    }

    res.status(200).json({ message: `Card marked as ${status}` });
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
  }
}
export async function setComplete(req, res) {
  try {
    const { userId, cardId } = req.body;
    const result = await UserToCard.updateOne(
      { userId, cardId },
      { $set: { status: "complete" } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User-card relation not found" });
    }
    res.status(200).json({ message: "Card marked as complete" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function setUncomplete(req, res) {
  try {
    const { userId, cardId } = req.body;
    const result = await UserToCard.updateOne(
      { userId, cardId },
      { $set: { status: "uncomplete" } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User-card relation not found" });
    }
    res.status(200).json({ message: "Card marked as uncomplete" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
