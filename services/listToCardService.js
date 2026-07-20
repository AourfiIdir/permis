import Contains from "../models/ListToItem.js"
import mongoose from "mongoose"

export async function getCardsfromList(req, res) {
  try {
    const { listId } = req.params
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ success: false, message: "Invalid list ID" })
    }

    const relations = await Contains.find({ listId }).populate("CardId")
    const cards = relations.map(r => r.CardId)

    res.status(200).json({ success: true, data: cards })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function addcardtoList(req, res) {
  try {
    const { listId, cardId } = req.params
    if (!mongoose.Types.ObjectId.isValid(listId) || !mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ success: false, message: "Invalid list ID or card ID" })
    }

    const relation = await Contains.create({ listId, CardId: cardId })
    res.status(201).json({ success: true, data: relation })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Card already in this list" })
    }
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function deletecardfromList(req, res) {
  try {
    const { listId, cardId } = req.params
    const deleted = await Contains.findOneAndDelete({ listId, CardId: cardId })
    if (!deleted) return res.status(404).json({ success: false, message: "Relation not found" })
    res.status(200).json({ success: true, message: "Card removed from list" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}
