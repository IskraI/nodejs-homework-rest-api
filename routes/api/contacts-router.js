import express from "express";
import contactsService from "../../models/contacts/contacts.js";

const contactsRouter = express.Router();

contactsRouter.get("/", async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

contactsRouter.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);
    if (!result) {
      return res.status(404).json({
        message: `Not found`,
      });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
  // const { contactId } = req.params;
  // const result = await contactsService.getContactById(contactId);
  // res.json(result);
});

// contactsRouter.post("/", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

// contactsRouter.delete("/:contactId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

// router.put("/:contactId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

export default contactsRouter;
