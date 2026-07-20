import { createCardSchema } from "../../Validators/cardValidator.js"
import Card from "../../models/Card.js"
import User from "../../models/User.js"
import UserToCard from "../../models/UserToCard.js"

export async function createCard(req, res) {
  const result = createCardSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.error.issues.map(e => e.message) })
  }

  try {
    const cardCreated = new Card(result.data)
    const savedCard = await cardCreated.save()

    const users = await User.find({}).select("_id")
    if (users.length > 0) {
      await UserToCard.insertMany(
        users.map(user => ({
          cardId: savedCard._id,
          userId: user._id,
          status: "uncomplete",
          hit: 0,
        }))
      )
    }

    res.status(201).json({ success: true, message: "Card created and assigned to all users" })
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function assignCards(req, res) {
  try {
    const userId = req.user.id
    const cards = await Card.find({}).select("_id")

    const existing = await UserToCard.find({ userId }).select("cardId -_id")
    const existingIds = new Set(existing.map(c => c.cardId.toString()))

    const missing = cards.filter(c => !existingIds.has(c._id.toString()))

    if (missing.length > 0) {
      await UserToCard.insertMany(
        missing.map(card => ({
          cardId: card._id,
          userId,
          status: "uncomplete",
          hit: 0,
        }))
      )
    }

    res.status(201).json({ success: true, message: "Cards assigned successfully", count: missing.length })
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}
