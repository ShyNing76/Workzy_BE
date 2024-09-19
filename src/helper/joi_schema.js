import Joi from "joi";

export const email = Joi.string().pattern(new RegExp('gmail.com$')).required();

export const password = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))

export const name = Joi.string().required()

export const title = Joi.string().required()

export const price = Joi.number().min(0).required()

export const available = Joi.number().min(0).required()

export const categoryId = Joi.string().alphanum().required()

export const image = Joi.string().uri().required()

export const bid = Joi.number().required()

export const refreshToken = Joi.string().required()