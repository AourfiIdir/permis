import express from 'express';
import { getListById, getLists,deleteList,createList,updateList } from '../services/listService.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.use(authenticateToken);

router.route("/").
    get(getLists);

router.route("/:id").
get(getListById);

router.route("/:id/cards").
delete(deleteList);

router.route("/").
post(createList);

router.route("/:id").
put(updateList);






export default router;