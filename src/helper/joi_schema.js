import Joi from "joi";

export const email = Joi.string().pattern(new RegExp('gmail.com$')).required();

export const password = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()

export const name = Joi.string().required()

export const phone = Joi.string().required()

export const gender = Joi.string().pattern(new RegExp('Male|Female|Other')).required()

export const date_of_birth = Joi.date().required()

export const title = Joi.string().required()

export const price = Joi.number().min(0).required()

export const location = Joi.string().pattern(new RegExp('Hanoi|HCM')).required()

export const address = Joi.string().required()

export const available = Joi.number().min(0).required()

export const categoryId = Joi.string().alphanum().required()

export const image = Joi.string().uri().required()

export const bid = Joi.number().required()

export const accessToken = Joi.string().required()

export const refreshToken = Joi.string().required()

export const workspace_name = Joi.string().pattern(new RegExp('^[A-Za-z0-9]+_[A-Za-z0-9]+_[0-9]+$')).required()

export const workspace_price = Joi.number().positive().required()
