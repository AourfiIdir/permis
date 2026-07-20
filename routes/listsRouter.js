import express from 'express'
import { getListById, getLists, deleteList, createList, updateList, addCardToList } from '../services/listService.js'
import authenticateToken from '../middleware/authenticateToken.js'

const router = express.Router()
router.use(authenticateToken)

router.route("/").get(getLists)
router.route("/").post(createList)
router.route("/:id").get(getListById)
router.route("/:id").delete(deleteList)
router.route("/:id").put(updateList)
router.route("/:listId/:cardId").post(addCardToList)

export default router
