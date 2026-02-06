import UserToCard from "../models/UserToCard.js";
import { updateUserCardSchema } from "../Validators/userToCardValidator.js";
import Card from "../models/Card.js";

// Get all cards for a user
// ...existing code...

// Get all cards for a user by category
export async function getUserCards(req, res) {
  try {
    const { categoryName } = req.params;
    const userId = req.user.id;
    console.log("Fetching cards for user:", userId, "in category:", categoryName);
    // Find cards by category name
    const cards = await Card.find({ category: categoryName });
    const cardIds = cards.map(card => card._id);

    // Find user-card relations for those cards
    const completions = await UserToCard.find({ 
      userId,
      cardId: { $in: cardIds }
    })
      .populate('cardId')  // Populate card details
      .sort({ createdAt: -1 });  // Optional: sort by newest first
    
    res.status(200).json(completions);
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
  }
}

// ...existing code...

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
    const { cardId, status } = req.body;
    const userId = req.user.id;
    if (!["completed", "uncomplete"].includes(status)) {
      return res.status(400).json({ message: "status must be 'completed' or 'uncomplete'" });
    }

    const result = await UserToCard.updateOne(
      { userId, cardId },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User-card relation not found" });
    }
    res.status(200).json({ message: `Card status set to ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}




export async function getCardStatus(req, res) {

  try {
    const userId = req.user.id;
    const { cardId } = req.params;
    const userToCard = await UserToCard.findOne

      ({ userId, cardId });
    if (!userToCard) {
      return res.status(404).json({ message: "User-card relation not found" });
    } 
    res.status(200).json({ status: userToCard.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function createUserCard(req, res) {
  try {
    const { cardId,userId } = req.body;
    const newUserToCard = new UserToCard({ userId, cardId, status: "uncomplete" });
    const savedUserToCard = await newUserToCard.save();
    res.status(201).json(savedUserToCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getHitCards(req, res) {
  const userId = req.user.id;

  try {
    let cards = await UserToCard.find({ userId, hit: {$gt:0} });

    if (cards.length === 0) {
      console.log("no cards")
      return res.status(404).json({
        message: "No cards found",
      });
    }
    cards = cards.map((card)=>{ 
      return card.cardId
    })
    return res.status(200).json({ cards
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}
// ...existing code...
export async function modifyHit(req, res) {
  const userId = req.user.id;
  const { cardId } = req.params;
  const { action } = req.body;

  try {
    if (action !== "inc" && action !== "dec") {
      return res.status(400).json({
        message: "Invalid action. Use 'inc' or 'dec'.",
      });
    }

    const incrementValue = action === "inc" ? 1 : -1;

    const query =
      action === "dec"
        ? { userId, cardId, hit: { $gt: 0 } }
        : { userId, cardId };

    const updatedCard = await UserToCard.findOneAndUpdate(
      query,
      { $inc: { hit: incrementValue } },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(400).json({
        message: "Hit cannot go below 0 or card not found",
      });
    }

    return res.status(200).json({
      message: "Hit updated successfully",
      card: updatedCard,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}
// ...existing code...
