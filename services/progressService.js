import Progress from "../models/Progress.js";
import {createProgressSchema,updateProgressSchema,progressIdParamsSchema} from "../Validators/progressValidator.js";

// Get all progresses
export async function getProgress(req, res) {
  try {
    const progresses = await Progress.find().populate("userId");
    res.status(200).json(progresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get progress by ID
export async function getProgressById(req, res) {
  try {
    const { id } = progressIdParamsSchema.parse(req.params);

    const progress = await Progress.findById(id).populate("userId");
    if (!progress) return res.status(404).json({ message: "Progress not found" });

    res.status(200).json(progress);
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
  }
}
// Get progress by User ID
export async function getProgressByUserId(req, res) {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const progresses = await Progress.find({ userId }).populate("userId").sort({ createdAt: -1 });
    if (progresses.length === 0) {
      return res.status(200).json({
        message: "No progress found for this user",
        progresses: []
      });
    }
    res.status(200).json({
      userId: userId,
      progressCount: progresses.length,
      progresses: progresses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Create progress
export async function createProgress(req, res) {
  try {
    const validatedData = createProgressSchema.parse(req.body);

    const progress = new Progress(validatedData);
    const savedProgress = await progress.save();

    res.status(201).json(savedProgress);
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
  }
}

// Update progress
export async function updateProgress(req, res) {
  try {
    const { id } = progressIdParamsSchema.parse(req.params);
    const validatedData = updateProgressSchema.parse(req.body);

    const updatedProgress = await Progress.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProgress) return res.status(404).json({ message: "Progress not found" });

    res.status(200).json(updatedProgress);
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
  }
}

// Delete progress
export async function deleteProgress(req, res) {
  try {
    const { id } = progressIdParamsSchema.parse(req.params);

    const deletedProgress = await Progress.findByIdAndDelete(id);
    if (!deletedProgress) return res.status(404).json({ message: "Progress not found" });

    res.status(200).json({ message: "Progress deleted successfully" });
  } catch (error) {
    if (error.name === "ZodError") {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
  }
}
