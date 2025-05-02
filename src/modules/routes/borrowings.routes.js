import { Router } from "express";
import { attachCreateQuery, attachDeleteQuery, attachGetQuery, attachUpdateQuery } from "../../middlewares/queries.middlewares.js";
import borrowingsModel from "../models/borrowings.model.js";
import execution, { validator } from "../../middlewares/globals.middlewares.js";
import { createBorrowingSchema, updateBorrowingSchema } from "../../validations/borrowings.validation.schemas.js";
import { filterQueryMiddleware } from "../../middlewares/features.middlewares.js";
import memberRoutes from "./members.routes.js";

const borrowingRoutes = Router();

borrowingRoutes.post("/", validator(createBorrowingSchema), attachCreateQuery(borrowingsModel), execution({
  success: {
    status: 201,
    message: "Borrowing created successfully",
  },
  failure: {
    status: 400,
    message: "Failed to create borrowing",
  },
}));

borrowingRoutes.put("/:id", validator(updateBorrowingSchema), attachUpdateQuery(borrowingsModel), filterQueryMiddleware({field:"_id", value:"id"}), execution({
  success: {
    status: 200,
    message: "Borrowing updated successfully",
  },
  failure: {
    status: 400,
    message: "Failed to update borrowing",
  },
}));

borrowingRoutes.delete("/:id", attachDeleteQuery(borrowingsModel), filterQueryMiddleware({field:"_id", value:"id"}), execution({
  success: {
    status: 200,
    message: "Borrowing deleted successfully",
  },
  failure: {
    status: 400,
    message: "Failed to delete borrowing",
  },
}));

borrowingRoutes.get("/", attachGetQuery(borrowingsModel), execution({
  success: {
    status: 200,
    message: "Borrowings retrieved successfully",
  },
  failure: {
    status: 400,
    message: "Failed to retrieve borrowings",
  },
}));

borrowingRoutes.get("/:id", attachGetQuery(borrowingsModel), filterQueryMiddleware({field:"_id", value:"id"}), execution({
  success: {
    status: 200,
    message: "Borrowing retrieved successfully",
  },
  failure: {
    status: 400,
    message: "Failed to retrieve borrowing",
  },
}));


export default borrowingRoutes;