import Contains from "../models/ListToItem.js";
import { addOrDeleteCardSchema, getCardsFromListParamsSchema } from "../Validators/listToCardValidator.js";
import mongoose from "mongoose"
// GET cards from a list
export async function getCardsfromList(req, res) {
  try {
    const { listId } = getCardsFromListParamsSchema.parse(req.params);

    const relations = await Contains.find({ listId }).populate("CardId");
    const cards = relations.map(r => r.CardId);

    res.status(200).json(cards);
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
  }
}

// ADD card to a list
export async function addcardtoList(req, res) {
  try {
    //const { listId, cardId } = addOrDeleteCardSchema.parse(req.params);
    const {listId,cardId} = req.params;
    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(listId) || !mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: "Invalid list ID or card ID" });
    }

    const relation = await Contains.create({ listId, CardId: cardId });
    res.status(201).json(relation);
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.issues.map(e => e.message) || [];
      return res.status(400).json({ message: messages });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "Card already in this list" });
    }
    res.status(500).json({ message: error.message });
  }
}

// DELETE card from a list
export async function deletecardfromList(req, res) {
  try {
    const { listId, cardId } = req.params;

    const deleted = await Contains.findOneAndDelete({ listId, CardId: cardId });
    if (!deleted) return res.status(404).json({ message: "Relation not found" });

    res.status(200).json({ message: "Card removed from list" });
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
  }
}
