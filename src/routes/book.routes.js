import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";


import { addBook,getBook,searchBooks } from "../controllers/book.controller.js";

const router = Router()

router.route('/book').post(verifyJWT,addBook)
router.route('/book/search').get(searchBooks)
router.route('/book/:id').get(getBook)
export default router