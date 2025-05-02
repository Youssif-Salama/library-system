import CatchErrorService, { AppError } from "../../services/error.services.js";
import borrowingsModel from "../models/borrowings.model.js";

export const allBooksBorrowingsByAspecificMember = CatchErrorService(async (req, res) => {
  const {memberId}=req.params;
  const findBorrowings = await borrowingsModel.find({ member: memberId }).populate("book");
  if (!findBorrowings.length) throw new AppError("No borrowings found for this member", 404);

  const books = findBorrowings.map(borrowing => borrowing.book);
  res.status(200).json({ books });
});


export const allBooksThatBoworrowedByTwoOrMoreDiffMembers = CatchErrorService(async (req, res) => {
  const findBorrowings = await borrowingsModel.find().populate("book member");
  if (!findBorrowings.length) throw new AppError("No borrowings found", 404);

  const bookBorrowings = findBorrowings.reduce((acc, borrowing) => {
    const bookId = borrowing.book._id.toString();
    if (!acc[bookId]) {
      acc[bookId] = {
        book: borrowing.book,
        members: new Set([borrowing.member._id.toString()])
      };
    } else {
      acc[bookId].members.add(borrowing.member._id.toString());
    }
    return acc;
  }, {});

  const popularBooks = Object.values(bookBorrowings)
    .filter(item => item.members.size >= 2)
    .map(item => item.book);

  if (!popularBooks.length) {
    throw new AppError("No books found that were borrowed by two or more different members", 404);
  }

  res.status(200).json({
    status: "success",
    results: popularBooks.length,
    books: popularBooks
  });
});