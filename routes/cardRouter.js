import express from 'express';

import authentificateToken from "../middleware/authenticateToken.js"
import {getCards,getCard,createCard,getByCetag} from "../services/cardService.js"

import authentificateToken from '../middleware/authenticateToken.js';



const router = express.Router();
router.use(authentificateToken);


router.
    route("/").
    get(getCards);


router.
    route("/:id").
    get(getCard);




router.
    route('/category').
    get(getByCetag);

router.
    route('/').
    post(createCard);

    /*
router.get('/', async (req, res) => {
  try {
    const Cards = await Card.find();
    res.status(200).json(Cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/:id', async (req, res) => {
    try {
        const Card = await Card.findById(req.params.id);
        if (!Card) {
            return res.status(404).json({ message: 'Module not found' });
        }
        res.status(200).json(Card);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/category', async (req, res) => {
    try {
        const categories = await Card.distinct('category');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/', async (req, res) => {
    try {
        const newCard = new Card(req.body);
        const savedCard = await newCard.save();
        res.status(201).json(savedCard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});  
*/
export default router;
