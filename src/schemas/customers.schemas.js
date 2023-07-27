import joiBase from "joi"
import joiDate from "@joi/date"

const joi = joiBase.extend(joiDate)


export const createCustomerSchema = joi.object({
    name: joi.string().trim().required().messages({
      'any.required': 'O campo "name" é obrigatório.',
      'string.empty': 'O campo "name" não pode estar vazio.',
    }),
    phone: joi.string().trim().min(10).max(11).pattern(/^\d+$/).required().messages({
      'any.required': 'O campo "phone" é obrigatório.',
      'string.empty': 'O campo "phone" não pode estar vazio.',
      'string.length': 'O campo "phone" deve ter exatamente 10 caracteres.',
      'string.pattern.base': 'O campo "phone" deve conter apenas números.',
    }),
    cpf: joi.string().trim().length(11).pattern(/^\d+$/).required().messages({
      'any.required': 'O campo "cpf" é obrigatório.',
      'string.empty': 'O campo "cpf" não pode estar vazio.',
      'string.length': 'O campo "cpf" deve ter exatamente 11 caracteres.',
      'string.pattern.base': 'O campo "cpf" deve conter apenas números.',
    }),
    birthday: joi.date().format(['YYYY-MM-DD']).required().messages({
      'any.required': 'O campo "birthday" é obrigatório.',
      'date.base': 'O campo "birthday" deve ser uma data válida no formato ISO (YYYY-MM-DD).',
    }),
  });