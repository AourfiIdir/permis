import express from 'express';
import { getCardsfromList,deletecardfromList,addcardtoList } from '../services/UserToCardList.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();
router.use(authenticateToken);
router.route("/").get(getCardsfromList);
router.route("/").post(addcardtoList);
router.route("/").delete(deletecardfromList);

export default router;


// // Get all cards of a list
// router.get('/:listId/cards', async (req, res) => {
//     const { listId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(listId)) {
//         return res.status(400).json({ message: "Invalid list ID" });
//     }

//     try {
//         const relations = await Contains.find({ listId }).populate('cardId');
//         const cards = relations.map(r => r.cardId);
//         res.json(cards);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Add a card to a list
// router.post('/', async (req, res) => {
//     const { listId, cardId } = req.body;
//     if (!listId || !cardId) {
//         return res.status(400).json({ message: "listId and cardId are required" });
//     }
//     if (!mongoose.Types.ObjectId.isValid(listId) || !mongoose.Types.ObjectId.isValid(cardId)) {
//         return res.status(400).json({ message: "Invalid listId or cardId" });
//     }

//     try {
//         const relation = await Contains.create({ listId, cardId });
//         res.status(201).json(relation);
//     } catch (error) {
//         if (error.code === 11000) {
//             return res.status(409).json({ message: "Card already in this list" });
//         }
//         res.status(400).json({ message: error.message });
//     }
// });

// // Remove a card from a list
// router.delete('/', async (req, res) => {
//     const { listId, cardId } = req.body;
//     if (!listId || !cardId) return res.status(400).json({ message: "listId and cardId are required" });
//     if (!mongoose.Types.ObjectId.isValid(listId) || !mongoose.Types.ObjectId.isValid(cardId)) {
//         return res.status(400).json({ message: "Invalid listId or cardId" });
//     }

//     const deleted = await Contains.findOneAndDelete({ listId, cardId });
//     if (!deleted) return res.status(404).json({ message: "Relation not found" });

//     res.json({ message: "Card removed from list" });

// });


