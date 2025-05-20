import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Book } from '../models/book.model.js'
import { Review } from "../models/review.model.js";


const addReview = asyncHandler(async (req, res) => {
    const { book_id } = req.params
    const { comment, rating } = req.body
    const user_id = req.user._id
    if (!comment || !rating) {
        throw new ApiError(400, 'Review and rating are required');
    }
    const book = await Book.findById(book_id);
    if (!book) {
        throw new ApiError(404, 'Book not found');
    }
    const existed_review = await Review.findOne({ user: user_id, book: book_id });
    if (existed_review) {
        throw new ApiError(409, 'You have already reviewed this book');
    }
    // Create review
    const newReview = await Review.create({
        user: user_id,
        book: book_id,
        comment,
        rating
    });

    return res.status(201).json(
        new ApiResponse(201, newReview, "Review added successfully")
    );
})


const updateReview = asyncHandler(async (req, res) => {
    const { review_id } = req.params;
    const { comment, rating } = req.body;
    const user_id = req.user._id;

    if (!comment && !rating) {
        throw new ApiError(400, 'At least one of comment or rating must be provided');
    }

    const existingReview = await Review.findById(review_id);
    if (!existingReview) {
        throw new ApiError(404, 'Review not found');
    }

    if (existingReview.user.toString() !== user_id.toString()) {
        throw new ApiError(403, 'You are not allowed to update this review');
    }

    // Update fields
    if (comment) existingReview.comment = comment;
    if (rating) existingReview.rating = rating;

    await existingReview.save();

    return res.status(200).json(
        new ApiResponse(200, existingReview, 'Review updated successfully')
    );
});

const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user_id = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
        throw new ApiError(404, 'Review not found');
    }

    if (review.user.toString() !== user_id.toString()) {
        throw new ApiError(403, 'You are not allowed to delete this review');
    }

    await review.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, 'Review deleted successfully')
    );
});



export { addReview, updateReview, deleteReview }


