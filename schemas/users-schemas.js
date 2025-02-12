import Joi from "joi";

import { emailRegexp, subscriptionList } from "../constants/user-constants.js";

const userRegisterSchema = Joi.object({
  // name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": `missing required 'email' field' `,
    "string.empty": `'email' cannot be an empty field`,
    "string.pattern.base": "not valid email",
  }),
  password: Joi.string().min(5).required().messages({
    "any.required": `input  'password' `,
    "string.empty": `'input  'password'`,
  }),
  subscription: Joi.string(),
  token: Joi.string(),
  // avatarURL: Joi.string(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": `missing required 'email' field' `,

    "string.empty": `'email' cannot be an empty field`,
    "string.pattern.base": "not valid email",
  }),
  password: Joi.string().min(5).required().messages({
    "any.required": `input  'password' ' `,

    "string.empty": `'password' cannot be an empty field`,
  }),
  subscription: Joi.string(),
  token: Joi.string(),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required()
    .messages({
      "any.required": 'missing field "subscription"',
      "any.only": `Must be one of 'starter', 'pro', or 'business'`,
    }),
});

export default {
  userRegisterSchema,
  userLoginSchema,
  updateSubscriptionSchema,
};
