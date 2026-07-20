import Mistake from '../models/Mistake.js'

export async function createMistake(req, res) {
  try {
    const { mistake, card } = req.body
    if (!mistake || !card) {
      return res.status(400).json({ success: false, message: "Mistake text and card ID are required" })
    }

    const newMistake = new Mistake({ mistake, card, user: req.user.id })
    const savedMistake = await newMistake.save()
    res.status(201).json({ success: true, data: savedMistake })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "This mistake already exists" })
    }
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function getMistakes(req, res) {
  try {
    const mistakes = await Mistake.find({ user: req.user.id })
    res.status(200).json({ success: true, data: mistakes })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function getMistakeById(req, res) {
  try {
    const { id } = req.params
    const foundMistake = await Mistake.findById(id)
    if (!foundMistake) {
      return res.status(404).json({ success: false, message: "Mistake not found" })
    }
    if (foundMistake.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }
    res.status(200).json({ success: true, data: foundMistake })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function getMistakeByUserId(req, res) {
  try {
    const { userId } = req.params
    if (userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    const mistakes = await Mistake.find({ user: userId })
      .populate('card')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, count: mistakes.length, mistakes })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function updateMistake(req, res) {
  try {
    const { id } = req.params
    const found = await Mistake.findById(id)
    if (!found) {
      return res.status(404).json({ success: false, message: "Mistake not found" })
    }
    if (found.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    const { mistake, card } = req.body
    const updated = await Mistake.findByIdAndUpdate(id, { mistake, card }, { new: true })
    res.status(200).json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function deleteMistake(req, res) {
  try {
    const { id } = req.params
    const found = await Mistake.findById(id)
    if (!found) {
      return res.status(404).json({ success: false, message: "Mistake not found" })
    }
    if (found.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    await Mistake.findByIdAndDelete(id)
    res.status(200).json({ success: true, message: "Mistake deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function deleteMistakeByQuestion(req, res) {
  try {
    const { question, card } = req.body
    if (!question || !card) {
      return res.status(400).json({ success: false, message: "Question and card are required" })
    }

    const deleted = await Mistake.findOneAndDelete({
      user: req.user.id,
      card: card,
      mistake: { $regex: question },
    })

    if (!deleted) {
      return res.status(404).json({ success: false, message: "No mistake found" })
    }

    res.status(200).json({ success: true, message: "Mistake removed" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}
