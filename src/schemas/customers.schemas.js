import Joi from "joi";


export const createCustomerSchema = Joi.object({
    name: Joi.string().trim().required().messages({
      'any.required': 'O campo "name" é obrigatório.',
      'string.empty': 'O campo "name" não pode estar vazio.',
    }),
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/).required().messages({
      'any.required': 'O campo "cpf" é obrigatório.',
      'string.empty': 'O campo "cpf" não pode estar vazio.',
      'string.length': 'O campo "cpf" deve ter exatamente 11 caracteres.',
      'string.pattern.base': 'O campo "cpf" deve conter apenas números.',
    }),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
      'any.required': 'O campo "phone" é obrigatório.',
      'string.empty': 'O campo "phone" não pode estar vazio.',
      'string.length': 'O campo "phone" deve ter exatamente 10 caracteres.',
      'string.pattern.base': 'O campo "phone" deve conter apenas números.',
    }),
    birthday: Joi.date().iso().required().messages({
      'any.required': 'O campo "birthday" é obrigatório.',
      'date.base': 'O campo "birthday" deve ser uma data válida no formato ISO (YYYY-MM-DD).',
    }),
  });