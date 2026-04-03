import {Router} from "express";
import {register,login,logout} from "../controllers/authController";
import { protect } from '../middlewares/authMiddleware';
import { destroyContainer } from '../controllers/dockerController';
const router=Router();
router.post('/register',register);
router.post('/login',login);
router.post('/logout',protect,logout); 
router.delete('/container',protect,destroyContainer);
export default router;


