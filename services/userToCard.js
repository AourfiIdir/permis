import UserToCard from "../models/UserToCard.js"
import Card from "../models/Card.js"

export async function getUserCards(req, res) {
  try {
    const { categoryName } = req.params
    const userId = req.user.id

    const cards = await Card.find({ category: categoryName })
    const cardIds = cards.map(card => card._id)

    const completions = await UserToCard.find({ userId, cardId: { $in: cardIds } })
      .populate('cardId')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, data: completions })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function updateCardStatus(req, res) {
  try {
    const { cardId, status } = req.body
    if (!cardId || !status) {
      return res.status(400).json({ success: false, message: "cardId and status are required" })
    }
    if (!["completed", "uncomplete"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'completed' or 'uncomplete'" })
    }

    const result = await UserToCard.updateOne(
      { userId: req.user.id, cardId },
      { $set: { status } }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User-card relation not found" })
    }

    res.status(200).json({ success: true, message: `Card marked as ${status}` })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function setComplete(req, res) {
  try {
    const { cardId, status } = req.body
    const userId = req.user.id

    if (!cardId || !status) {
      return res.status(400).json({ success: false, message: "cardId and status are required" })
    }
    if (!["completed", "uncomplete"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'completed' or 'uncomplete'" })
    }

    const result = await UserToCard.updateOne({ userId, cardId }, { $set: { status } })

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User-card relation not found" })
    }
    res.status(200).json({ success: true, message: `Card status set to ${status}` })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function getCardStatus(req, res) {
  try {
    const userId = req.user.id
    const { cardId } = req.params
    const userToCard = await UserToCard.findOne({ userId, cardId })
    if (!userToCard) {
      return res.status(404).json({ success: false, message: "User-card relation not found" })
    }
    res.status(200).json({ success: true, status: userToCard.status })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function createUserCard(req, res) {
  try {
    const { cardId, userId } = req.body
    if (!cardId || !userId) {
      return res.status(400).json({ success: false, message: "cardId and userId are required" })
    }
    const newUserToCard = new UserToCard({ userId, cardId, status: "uncomplete" })
    const savedUserToCard = await newUserToCard.save()
    res.status(201).json({ success: true, data: savedUserToCard })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function getHitCards(req, res) {
  try {
    const userId = req.user.id
    const cards = await UserToCard.find({ userId, hit: { $gt: 0 } }).populate("cardId")

    if (cards.length === 0) {
      return res.status(200).json({ success: true, cards: [] })
    }

    return res.status(200).json({ success: true, cards: cards.map(c => c.cardId) })
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function modifyHit(req, res) {
  try {
    const userId = req.user.id
    const { cardId } = req.params
    const { action } = req.body

    if (action !== "inc" && action !== "dec") {
      return res.status(400).json({ success: false, message: "Invalid action. Use 'inc' or 'dec'." })
    }

    const incrementValue = action === "inc" ? 1 : -1
    const query = action === "dec"
      ? { userId, cardId, hit: { $gt: 0 } }
      : { userId, cardId }

    const updatedCard = await UserToCard.findOneAndUpdate(
      query,
      { $inc: { hit: incrementValue } },
      { new: true }
    )

    if (!updatedCard) {
      return res.status(400).json({ success: false, message: "Hit cannot go below 0 or card not found" })
    }

    return res.status(200).json({ success: true, card: updatedCard })
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function getCardsForUser(req, res) {
  try {
    const userId = req.user.id
    const result = await UserToCard.find({ userId })
    if (!result || result.length === 0) {
      return res.status(404).json({ success: false, message: "No cards found for this user" })
    }
    res.status(200).json({ success: true, data: result })
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}
