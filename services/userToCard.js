import usertocard from "../models/UserToCard.js";
import mongoose from "mongoose";
export async function getCompletions(req,res){
  try {
    const completions = await usertocard.find()
      .populate('cardId')
      .populate('userId');
    res.status(200).json(completions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function addCompletion(req,res){
  const { cardId, userId, status } = req.body;
    if (!cardId || !userId || !status) {
        return res.status(400).json({ message: "cardId, userId, and status are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(cardId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid cardId or userId" });
    }
    try {
        const completion = await usertocard.create({ cardId, userId, status });
        res.status(201).json(completion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function getCompletionsByUser(req,res){
  const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
    }
    try {
        const completions = await usertocard.find({ userId })
            .populate('cardId')
            .populate('userId');
        res.status(200).json(completions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function getCompletionsByCard(req,res){
  const { cardId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return res.status(400).json({ message: "Invalid cardId" });
    }
    try {
        const completions = await usertocard.find({ cardId })
            .populate('cardId')
            .populate('userId');
        res.status(200).json(completions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export async function deleteCompletion(req,res){
  const { cardId, userId } = req.body;
    if (!cardId || !userId) {
        return res.status(400).json({ message: "cardId and userId are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(cardId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid cardId or userId" });
    }
    try {
        const deleted = await usertocard.findOneAndDelete({ cardId, userId });
        if (!deleted) {
            return res.status(404).json({ message: "Completion not found" });
        }
        res.json({ message: "Completion deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
}
export async function updateCompletionStatus(req,res){
  const { id } = req.params;
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid completion ID" });
    }
    if (!['completed', 'incomplete'].includes(status)) {
        return res.status(400).json({ message: "Status must be 'completed' or 'incomplete'" });
    }
    try {
        const CpUpdated = await usertocard.findByIdAndUpdate
            (id,
            { status },
            { new: true, runValidators: true }
        );
        if (!CpUpdated) return res.status(404).json({ message: "Completion not found" });
        res.status(200).json(CpUpdated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
