import CatchErrorService, { AppError } from "../../services/error.services.js";
import mongoose from "mongoose";
import borrowingsModel from "../models/borrowings.model.js";
import booksModel from "../models/books.model.js";

export const getBookBorrowingMembers = CatchErrorService(async (req, res) => {
  const { bookQuery } = req.params;
  let query = {};

  if (mongoose.Types.ObjectId.isValid(bookQuery)) {
    query = { book: bookQuery };
  } else {
    const book = await booksModel.findOne({ name: bookQuery });
    if (!book) throw new AppError("Book not found", 404);
    query = { book: book._id };
  }

  const findBorrowings = await borrowingsModel.find(query).populate("member");
  if (!findBorrowings.length) throw new AppError("No borrowings found for this book", 404);

  const members = findBorrowings.map(borrowing => borrowing.member);
  res.status(200).json({ members });
});
