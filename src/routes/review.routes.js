import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addReview,updateReview,deleteReview } from "../controllers/review.controller.js";
const router = Router()

router.route('/:book_id').post(verifyJWT,addReview)
router.route('/:book_id').patch(verifyJWT,updateReview)
router.route('/:id').delete(verifyJWT,deleteReview)
export default router