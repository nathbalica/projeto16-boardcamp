import Joi from "joi";

export const gamesSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'any.required': 'O campo "name" é obrigatório.',
    'string.empty': 'O campo "name" não pode estar vazio.',
  }),
  image: Joi.string().uri().trim().required().messages({
    'any.required': 'O campo "image" é obrigatório.',
    'string.empty': 'O campo "image" não pode estar vazio.',
  }),
  stockTotal: Joi.number().integer().min(1).required().messages({
    'any.required': 'O campo "stockTotal" é obrigatório.',
    'number.base': 'O campo "stockTotal" deve ser um número.',
    'number.integer': 'O campo "stockTotal" deve ser um número inteiro.',
    'number.min': 'O campo "stockTotal" não pode ser menor que 0.',
  }),
  pricePerDay: Joi.number().integer().min(1).required().messages({
    'any.required': 'O campo "pricePerDay" é obrigatório.',
    'number.base': 'O campo "pricePerDay" deve ser um número.',
    'number.positive': 'O campo "pricePerDay" deve ser um número positivo.',
    'number.min': 'O campo "pricePerDay" não pode ser menor que 0.',
  }),
});
