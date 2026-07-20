import Card from "../models/Card.js"
import { createCardSchema } from "../Validators/cardValidator.js"

export async function getCards(req, res) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    const cards = await Card.find().skip(skip).limit(limit)
    const total = await Card.countDocuments()

    res.status(200).json({ success: true, data: cards, page, limit, total })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function getCard(req, res) {
  try {
    const card = await Card.findById(req.params.id)
    if (!card) {
      return res.status(404).json({ success: false, message: "Card not found" })
    }
    res.status(200).json({ success: true, data: card })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function getByCategory(req, res) {
  try {
    const { categoryName } = req.params
    const cards = await Card.find({ category: categoryName })
    res.status(200).json({ success: true, data: cards })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function createCard(req, res) {
  try {
    const validatedData = createCardSchema.parse(req.body)
    const newCard = new Card(validatedData)
    const savedCard = await newCard.save()
    res.status(201).json({ success: true, data: savedCard })
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.issues.map(e => e.message)
      return res.status(400).json({ success: false, message: messages })
    }
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function getCategories(req, res) {
  try {
    const categories = await Card.distinct("category")
    res.status(200).json({ success: true, data: categories })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}
