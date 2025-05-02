import { Router } from "express";
import { attachCreateQuery, attachDeleteQuery, attachGetQuery, attachUpdateQuery } from "../../middlewares/queries.middlewares.js";
import booksModel from "../models/books.model.js";
import execution, { validator } from "../../middlewares/globals.middlewares.js";
import { createBookSchema, updateBookSchema } from "../../validations/books.validation.schemas.js";
import { filterQueryMiddleware } from "../../middlewares/features.middlewares.js";
import { getBookBorrowingMembers } from "../controllers/books.controllers.js";

const bookRoutes = Router();

bookRoutes.post("/", validator(createBookSchema), attachCreateQuery(booksModel), execution({
  success: {
    status: 201,
    message: "Book created successfully",
  },
  failure: {
    status: 400,
    message: "Failed to create book",
  },
}));

bookRoutes.put("/:id", validator(updateBookSchema), attachUpdateQuery(booksModel), filterQueryMiddleware({field:"_id", value:"id"}), execution({
  success: {
    status: 200,
    message: "Book updated successfully",
  },
  failure: {
    status: 400,
    message: "Failed to update book",
  },
}));

bookRoutes.delete("/:id", attachDeleteQuery(booksModel), filterQueryMiddleware({field:"_id", value:"id"}), execution({
  success: {
    status: 200,
    message: "Book deleted successfully",
  },
  failure: {
    status: 400,
    message: "Failed to delete book",
  },
}));

bookRoutes.get("/", attachGetQuery(booksModel), execution({
  success: {
    status: 200,
    message: "Books retrieved successfully",
  },
  failure: {
    status: 400,
    message: "Failed to retrieve books",
  },
}));

bookRoutes.get("/:id", attachGetQuery(booksModel), filterQueryMiddleware({field:"_id", value:"id"}), execution({
  success: {
    status: 200,
    message: "Book retrieved successfully",
  },
  failure: {
    status: 400,
    message: "Failed to retrieve book",
  },
}));

bookRoutes.get("/:bookQuery/members",getBookBorrowingMembers)

export default bookRoutes;