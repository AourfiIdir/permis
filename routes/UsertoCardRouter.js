import express from 'express';
import { getCompletions,getCompletionsByCard,updateCompletionStatus,deleteCompletion,getCompletionsByUser } from '../services/userToCard.js';
import authenticateToken from '../middleware/authenticateToken.js';


const router = express.Router();
router.use(authenticateToken);
router.route("/").get(getCompletions);
router.route("/user/:userId").get(getCompletionsByUser);
router.route("/card/:cardId").get(getCompletionsByCard);
router.route("/").post(updateCompletionStatus);
router.route("/:id").delete(deleteCompletion);

// GET all completions
//_req is an unused parameter

// router.get('/', async (_req, res) => {
//     try {
//         const completions = await Complete.find()
//             .populate('cardId')
//             .populate('userId');
//         res.status(200).json(completions);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // GET completions by user or card

// router.get('/user/:userId', async (req, res) => {
//     const { userId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//         return res.status(400).json({ message: "Invalid userId" });
//     }

//     try {
//         const completions = await Complete.find({ userId })
//             .populate('cardId')
//             .populate('userId');
//         res.status(200).json(completions);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// router.get('/card/:cardId', async (req, res) => {
//     const { cardId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(cardId)) {
//         return res.status(400).json({ message: "Invalid cardId" });
//     }

//     try {
//         const completions = await Complete.find({ cardId })
//             .populate('cardId')
//             .populate('userId');
//         res.status(200).json(completions);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // POST a new completion

// router.post('/', async (req, res) => {
//     const { cardId, userId, status } = req.body;

//     if (!cardId || !userId || !status) {
//         return res.status(400).json({ message: "cardId, userId, and status are required" });
//     }
//     if (!mongoose.Types.ObjectId.isValid(cardId) || !mongoose.Types.ObjectId.isValid(userId)) {
//         return res.status(400).json({ message: "Invalid cardId or userId" });
//     }
//     if (!['completed', 'incomplete'].includes(status)) {
//         return res.status(400).json({ message: "Status must be 'completed' or 'incomplete'" });
//     }

//     try {
//         const completion = await Complete.create({ cardId, userId, status });
//         res.status(201).json(completion);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // PUT to update status

// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ message: "Invalid completion ID" });
//     }
//     if (!['completed', 'incomplete'].includes(status)) {
//         return res.status(400).json({ message: "Status must be 'completed' or 'incomplete'" });
//     }

//     try {
//         const CpUpdated = await Complete.findByIdAndUpdate(
//             id,
//             { status },
//             { new: true, runValidators: true }
//         );
//         if (!CpUpdated) return res.status(404).json({ message: "Completion not found" });
//         res.status(200).json(CpUpdated);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // DELETE a completion

// router.delete('/:id', async (req, res) => {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ message: "Invalid completion ID" });
//     }

//     try {
//         const CpDeleted = await Complete.findByIdAndDelete(id);
//         if (!CpDeleted) return res.status(404).json({ message: "Completion not found" });
//         res.status(200).json({ message: "Completion deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

export default router;
