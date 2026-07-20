import Progress from "../models/Progress.js"
import { createProgressSchema, updateProgressSchema, progressIdParamsSchema } from "../Validators/progressValidator.js"

export async function getProgress(req, res) {
  try {
    const progresses = await Progress.find({ userId: req.user.id }).populate("userId")
    res.status(200).json({ success: true, data: progresses })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function getProgressById(req, res) {
  try {
    const { id } = progressIdParamsSchema.parse(req.params)
    const progress = await Progress.findById(id).populate("userId")
    if (!progress) return res.status(404).json({ success: false, message: "Progress not found" })
    if (progress.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }
    res.status(200).json({ success: true, data: progress })
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.issues.map(e => e.message)
      return res.status(400).json({ success: false, message: messages })
    }
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function getProgressByUserId(req, res) {
  try {
    const userId = req.user.id
    const progresses = await Progress.find({ userId }).populate("userId").sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      userId,
      progressCount: progresses.length,
      progresses,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function createProgress(req, res) {
  try {
    const validatedData = createProgressSchema.parse({ ...req.body, userId: req.user.id })
    const progress = new Progress(validatedData)
    const savedProgress = await progress.save()
    res.status(201).json({ success: true, data: savedProgress })
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.issues.map(e => e.message)
      return res.status(400).json({ success: false, message: messages })
    }
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function updateProgress(req, res) {
  try {
    const { id } = progressIdParamsSchema.parse(req.params)
    const existing = await Progress.findById(id)
    if (!existing) return res.status(404).json({ success: false, message: "Progress not found" })
    if (existing.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    const validatedData = updateProgressSchema.parse(req.body)
    const updatedProgress = await Progress.findByIdAndUpdate(id, validatedData, { new: true, runValidators: true })
    res.status(200).json({ success: true, data: updatedProgress })
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.issues.map(e => e.message)
      return res.status(400).json({ success: false, message: messages })
    }
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function deleteProgress(req, res) {
  try {
    const { id } = progressIdParamsSchema.parse(req.params)
    const existing = await Progress.findById(id)
    if (!existing) return res.status(404).json({ success: false, message: "Progress not found" })
    if (existing.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    await Progress.findByIdAndDelete(id)
    res.status(200).json({ success: true, message: "Progress deleted successfully" })
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.issues.map(e => e.message)
      return res.status(400).json({ success: false, message: messages })
    }
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}
