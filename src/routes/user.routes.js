import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} from '../controllers/user.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/register').post(registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyJWT,logoutUser);
router.post('/refresh-token', refreshAccessToken);

export default router;
