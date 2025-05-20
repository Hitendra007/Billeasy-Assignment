import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Book } from '../models/book.model.js'
import { Review } from "../models/review.model.js";


const addBook = asyncHandler(async (req, res) => {
    const { title, author, price ,genre} = req.body
    if (!title || !author || !price || !genre) {
        throw new ApiError(409, 'title , author ,price required!! ')
    }
    const user = req.user._id
    const book = await Book.create({
        title,
        author,
        price,
        genre,
        user
    })

    const createdBoook = await Book.findById(book._id)
    if (!createdBoook) {
        throw new ApiError(500, 'Internal server error')
    }

    res.status(200).json(new ApiResponse(200, { "Book": createdBoook }, "Book added"))
})

const getBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query;
    const book = await Book.findById(id);
    if (!book) {
        throw new ApiError(404, 'Book not found');
    }
    const aggregateQuery = Review.aggregate([
        { $match: { book: book._id } },
        {
            $facet: {
                paginatedResults: [
                    { $sort: { createdAt: -1 } },
                    { $skip: (Number(page) - 1) * Number(limit) },
                    { $limit: Number(limit) }
                ],
                averageRating: [
                    {
                        $group: {
                            _id: '$book',
                            avgRating: { $avg: '$rating' }
                        }
                    }
                ]
            }
        }
    ]);
    const result = await Review.aggregatePaginate(aggregateQuery, {
        page: Number(page),
        limit: Number(limit),
    });

    const reviews = result.docs[0]?.paginatedResults || [];
    const averageRating = result.docs[0]?.averageRating[0]?.avgRating || 0;

    return res.status(200).json(
        new ApiResponse(200, {
            book,
            averageRating: averageRating.toFixed(2),
            reviews,
            pagination: {
                totalDocs: result.totalDocs,
                totalPages: result.totalPages,
                page: result.page,
                limit: result.limit
            }
        }, "Book details fetched")
    );
})


const searchBooks = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  const searchRegex = new RegExp(query, "i"); // case-insensitive partial match

  const aggregate = Book.aggregate([
    {
      $match: {
        $or: [
          { title: { $regex: searchRegex } },
          { author: { $regex: searchRegex } }
        ]
      }
    }
  ]);

  const results = await Book.aggregatePaginate(aggregate, { page, limit });

  return res.status(200).json(
    new ApiResponse(200, {
      books: results.docs,
      pagination: {
        totalDocs: results.totalDocs,
        totalPages: results.totalPages,
        page: results.page,
        limit: results.limit
      }
    }, "Books fetched successfully")
  );
});


const getAllBooks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, author, genre } = req.query;

  const query = {};
  if (author) query.author = new RegExp(author, "i");
  if (genre) query.genre = new RegExp(genre, "i");

  const aggregate = Book.aggregate([{ $match: query }]);

  const results = await Book.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  if (!results.docs || results.docs.length === 0) {
    throw new ApiError(404, "No books found");
  }

  return res.status(200).json(
    new ApiResponse(200, {
      books: results.docs,
      pagination: {
        totalDocs: results.totalDocs,
        totalPages: results.totalPages,
        page: results.page,
        limit: results.limit
      }
    }, "Books fetched successfully")
  );
});


export { addBook, getBook,searchBooks ,getAllBooks }