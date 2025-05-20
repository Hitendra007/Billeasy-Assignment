import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";


import { addBook,getBook,searchBooks,getAllBooks } from "../controllers/book.controller.js";

const router = Router()
router.route('').get(getAllBooks)
router.route('/book').post(verifyJWT,addBook)
router.route('/book/search').get(searchBooks)
router.route('/book/:id').get(getBook)
export default router