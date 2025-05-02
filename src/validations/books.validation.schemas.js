import Joi from 'joi';
export const createBookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.object({
    name: Joi.string().required(),
    description: Joi.string()
  }),
  description: Joi.string().required(),
  type: Joi.string().valid('fiction', 'non-fiction', 'biography', 'science', 'history').required(),
  publishedDate: Joi.date().required()
})

export const updateBookSchema = Joi.object({
  title: Joi.string(),
  author: Joi.object({
    name: Joi.string(),
    description: Joi.string()
  }),
  description: Joi.string(),
  type: Joi.string().valid('fiction', 'non-fiction', 'biography', 'science', 'history'),
  publishedDate: Joi.date()
}).or('title', 'author', 'description', 'type', 'publishedDate');