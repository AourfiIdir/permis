import express from 'express';
import { getListById, getLists,deleteList,createList,updateList,addCardToList} from '../services/listService.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.use(authenticateToken);

//router returns lists specified to an user
router.route("/").
    get(getLists);

//create a list
router.route("/").
post(createList);


router.route("/:id").
get(getListById);


//delete a list
router.route("/:id").
delete(deleteList)



router.route("/:id").
put(updateList);

router.route("/:listId/:cardId").post(addCardToList);




export default router;