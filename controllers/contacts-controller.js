//model
import Contact from "../models/contact.js";
//ctrlWrapper -try catch, HttpError - error list
import { HttpError, ctrlWrapper } from "../helpers/index.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.find({ owner }, "-createdAt -updatedAt");
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId, "-createdAt -updatedAt");
  if (!result) {
    throw HttpError(404, `Not found contact with id=${contactId}`);
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }

  res.json({ message: "contact deleted" });
};

//
const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
