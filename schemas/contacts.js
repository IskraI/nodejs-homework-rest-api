import Joi from "joi";

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "any.required": `missing required 'name' field'`,
    "string.empty": `'name' cannot be an empty field`,
  }),
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "any.required": `missing required 'email' field' `,

    "string.empty": `'email' cannot be an empty field`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `missing required 'phone' field `,
    "string.empty": `'phone' cannot be an empty field`,
  }),
  favorite: Joi.boolean().messages({
    "any.required": `missing required 'favorite' field `,
  }),
});

const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": `missing required 'favorite' field `,
  }),
});

export default { contactSchema, contactUpdateFavoriteSchema };
