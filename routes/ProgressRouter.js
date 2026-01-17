import express from 'express';
import {getProgress,getProgressById,createProgress,updateProgress,deleteProgress  } from '../services/progressService.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();
router.use(authenticateToken);
router.route("/").get(getProgress);
router.route("/:id").get(getProgressById);
router.route("/").post(createProgress);
router.route("/:id").put(updateProgress);
router.route("/:id").delete(deleteProgress);

// GET all progress

// router.get('/', async (_req, res) => {
//   try {
//     const progresses = await Progress.find()
//       .populate('cardId')
//       .populate('userId');
//     res.status(200).json(progresses);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // GET progress by ID

// router.get('/:id', async (req, res) => {
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: "Invalid ID" });
//   }

//   try {
//     const progress = await Progress.findById(id)
//       .populate('cardId')
//       .populate('userId');
//     if (!progress) return res.status(404).json({ message: "Progress not found" });
//     res.status(200).json(progress);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // POST new progress

// router.post('/', async (req, res) => {
//   const { cardId, userId, status } = req.body;

//   if (!cardId || !userId || !status) {
//     return res.status(400).json({ message: "cardId, userId, and status are required" });
//   }

//   if (!mongoose.Types.ObjectId.isValid(cardId) || !mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({ message: "Invalid cardId or userId" });
//   }

//   try {
//     const progress = await Progress.create({ cardId, userId, status });
//     res.status(201).json(progress);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // PUT update progress by ID

// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: "Invalid ID" });
//   }

//   if (!status) {
//     return res.status(400).json({ message: "status is required" });
//   }

//   try {
//     const updated = await Progress.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true, runValidators: true }
//     );

//     if (!updated) return res.status(404).json({ message: "Progress not found" });
//     res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // DELETE progress by ID

// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: "Invalid ID" });
//   }

//   try {
//     const Pgdeleted = await Progress.findByIdAndDelete(id);
//     if (!Pgdeleted) return res.status(404).json({ message: "Progress not found" });
//     res.status(200).json({ message: "Progress deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

export default router;
