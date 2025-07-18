const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const updateSchema = Joi.object({
  username: Joi.string().min(3),
  email: Joi.string().email()
});

module.exports = { registerSchema, updateSchema };