import Joi from "joi";

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "any.required": `'name' is a required field `,
    "string.empty": `'name' cannot be an empty field`,
  }),
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "any.required": `'email' is a required field `,
    "string.empty": `'email' cannot be an empty field`,
  }),
  phone: Joi.string()
    // .regex(/^\([0-9]{3}\) [0-9]{3} [0-9]{2} [0-9]{2}/)
    .required()
    .messages({
      //   "string.pattern.base": `Phone number must have only 10 digits.`,
      "any.required": `'phone' is a required field `,
      "string.empty": `'name' cannot be an empty field`,
    }),
});

export default contactSchema;
