import express from 'express'
import { getCardStatus, updateCardStatus, setComplete, getUserCards, createUserCard, getHitCards, modifyHit, getCardsForUser } from '../services/userToCard.js'
import authenticateToken from '../middleware/authenticateToken.js'

const router = express.Router()
router.use(authenticateToken)

router.route("/").post(createUserCard)
router.route("/").get(getCardsForUser)
router.route("/user/:categoryName").get(getUserCards)
router.route("/status").put(updateCardStatus)
router.route("/complete").post(setComplete)
router.route("/status/:cardId").get(getCardStatus)
router.route("/hitCards").get(getHitCards)
router.route("/hitCards/:cardId").put(modifyHit)

export default router
