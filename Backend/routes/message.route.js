import Router from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { sendMessage,getMessages } from '../controllers/message.controller.js';

const router=Router();

router.route("/send/:id").post(isAuthenticated,sendMessage)
router.route("/all/:id").get(isAuthenticated,getMessages)



 

export default router;