import Joi from 'joi';
export const createMemberSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  age: Joi.number().integer().min(0).required(),
  membershipType: Joi.string().valid('regular', 'premium', 'vip').required(),
})

export const updateMemberSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  age: Joi.number().integer().min(0),
  membershipType: Joi.string().valid('regular', 'premium', 'vip'),
}).or('name', 'age', 'membershipType');