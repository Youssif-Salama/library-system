import Joi from 'joi';
export const createBorrowingSchema = Joi.object({
  member: Joi.string().required(),
  book: Joi.string().required(),
  borrowDate: Joi.date().required(),
  returnDate: Joi.date().required()
})

export const updateBorrowingSchema = Joi.object({
  member: Joi.string(),
  book: Joi.string(),
  borrowDate: Joi.date(),
  returnDate: Joi.date()
}).or('member', 'book', 'borrowDate', 'returnDate')