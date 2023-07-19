import express from "express";

import contactsCtrls from "../../controllers/contacts.js";
import validation from "../../middlewares/index.js";
// import isEmptyBody from "../middlewares/emptyBody.js";
import contactSchema from "../../schemas/contacts.js";
const contactsRouter = express.Router();

contactsRouter.get("/", contactsCtrls.getAllContacts);

contactsRouter.get("/:contactId", contactsCtrls.getContactById);

contactsRouter.post(
  "/",
  validation.isEmptyBody,
  validation.validateBody(contactSchema),
  contactsCtrls.addContact
);

contactsRouter.delete("/:contactId", contactsCtrls.deleteContact);

contactsRouter.put(
  "/:contactId",
  validation.isEmptyBody,
  validation.validateBody(contactSchema),
  contactsCtrls.updateContact
);

export default contactsRouter;
