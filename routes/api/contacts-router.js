import express from "express";

import contactsCtrls from "../../controllers/contacts.js";
import validation from "../../middlewares/index.js";
import contactSchema from "../../schemas/contacts.js";
const contactsRouter = express.Router();

contactsRouter.get("/", contactsCtrls.getAllContacts);

contactsRouter.get(
  "/:contactId",
  validation.isValidId,
  contactsCtrls.getContactById
);

contactsRouter.post(
  "/",
  validation.isEmptyBody,
  validation.validateBody(contactSchema.contactSchema),
  contactsCtrls.addContact
);

contactsRouter.delete(
  "/:contactId",
  validation.isValidId,
  contactsCtrls.deleteContact
);

contactsRouter.put(
  "/:contactId",
  validation.isValidId,
  validation.isEmptyBody,
  validation.validateBody(contactSchema.contactSchema),
  contactsCtrls.updateContact
);

contactsRouter.patch(
  "/:contactId/favorite",
  validation.isValidId,
  validation.isEmptyBody,
  validation.validateBody(contactSchema.contactUpdateFavoriteSchema),
  contactsCtrls.updateFavorite
);

export default contactsRouter;
