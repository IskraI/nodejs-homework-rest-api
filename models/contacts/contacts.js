import fs from "fs/promises";
import { nanoid } from "nanoid";
import path from "path";

// const contactsPath = path.join(__dirname, "db", "contacts.json");
const contactsPath = path.resolve("models", "contacts", "contacts.json");

const updateList = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

export const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

export const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contactById = contacts.find((contact) => contact.id === contactId);
  return contactById || null;
};

export const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  updateList(contacts);
  return result;
};

export const addContact = async (data) => {
  console.log("addContact");
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...data,
  };
  contacts.push(newContact);
  updateList(contacts);
  return newContact;
};

export const updateContact = async (contactId, { name, email, phone }) => {
  const movies = await getAllMovies();
  console.log("updateContact");
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { contactId, name, email, phone };
  // "id": "qdggE76Jtbfd9eWJHrssH",
  //   "name": "Chaim Lewis",
  //   "email": "dui.in@egetlacus.ca",
  //   "phone": "(294) 840-6685"
  await updateList(contacts);
  return contacts[index];
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
