import List from "../models/List.js"
import mongoose from "mongoose"
import { createListSchema } from "../Validators/listValidator.js"

export async function getLists(req, res) {
  try {
    const userId = req.user.id
    const lists = await List.find({ createdBy: userId }).populate("cards", "name category")
    res.status(200).json({ success: true, data: lists })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function getListById(req, res) {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" })
  }

  try {
    const list = await List.findById(id).populate("cards", "name category imageURI")
    if (!list) return res.status(404).json({ success: false, message: "List not found" })
    if (list.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }
    res.status(200).json({ success: true, data: list })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function deleteList(req, res) {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" })
  }

  try {
    const list = await List.findById(id)
    if (!list) return res.status(404).json({ success: false, message: "List not found" })
    if (list.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    await List.findByIdAndDelete(id)
    res.status(200).json({ success: true, message: "List deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function createList(req, res) {
  try {
    const validatedData = createListSchema.parse(req.body)
    const userId = req.user.id

    const newList = new List({ ...validatedData, createdBy: userId, cards: [] })
    const savedList = await newList.save()

    res.status(201).json({ success: true, data: savedList })
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.issues.map(e => e.message)
      return res.status(400).json({ success: false, message: messages })
    }
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function updateList(req, res) {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" })
  }

  try {
    const list = await List.findById(id)
    if (!list) return res.status(404).json({ success: false, message: "List not found" })
    if (list.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    const updateListSchema = createListSchema.partial()
    const validatedData = updateListSchema.parse(req.body)

    const updatedList = await List.findByIdAndUpdate(id, validatedData, { new: true, runValidators: true })
    res.status(200).json({ success: true, data: updatedList })
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.issues.map(e => e.message)
      return res.status(400).json({ success: false, message: messages })
    }
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function addCardToList(req, res) {
  const { listId, cardId } = req.params
  try {
    const list = await List.findById(listId)
    if (!list) return res.status(404).json({ success: false, message: "List not found" })
    if (list.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    const updatedList = await List.findByIdAndUpdate(listId, { $addToSet: { cards: cardId } }, { new: true })
    res.status(200).json({ success: true, message: "Card added to list" })
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}
