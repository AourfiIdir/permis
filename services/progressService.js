import Progress from "../models/Progress.js";
import mongoose from "mongoose";
export async function getProgress(req,res){
  try {
    const progresses = await Progress.find()
      .populate('cardId')
      .populate('userId');
    res.status(200).json(progresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getProgressById(req,res){
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
    try {
        const progress = await Progress.findById(id)
          .populate('cardId')
          .populate('userId');
        if (!progress) return res.status(404).json({ message: "Progress not found" });
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function createProgress(req,res){
  const { cardId, userId, status } = req.body;
    if (!cardId || !userId || !status) {
        return res.status(400).json({ message: "cardId, userId, and status are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(cardId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid cardId or userId" });
    }
    try {
        const progress = await Progress.create({ cardId, userId, status });
        res.status(201).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }  
}
export async function updateProgress(req,res){
  const { id } = req.params;
  const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const progressUpdated = await Progress.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );
        if (!progressUpdated) return res.status(404).json({ message: "Progress not found" });
        res.status(200).json(progressUpdated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function deleteProgress(req,res){
  const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const deletedProgress = await Progress.findByIdAndDelete(id);
        if (!deletedProgress) return res.status(404).json({ message: "Progress not found" });
        res.status(200).json({ message: "Progress deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}