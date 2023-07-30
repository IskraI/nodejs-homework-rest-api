//model
import User from "../models/user.js";

//ctrlWrapper -try catch, HttpError - error list
import { HttpError, ctrlWrapper } from "../helpers/index.js";

//hash password
import bcrypt from "bcryptjs";

//create token
import jwt from "jsonwebtoken";
import "dotenv/config";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError("409", "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await User.create({ ...req.body, password: hashPassword });

  res
    .status(201)
    .json({ email: result.email, subscription: result.subscription });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError("401", "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError("401", "Email or password is wrong");
  }

  const payload = { id: user._id };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });
  console.log("token", token);
  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const currentUser = (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  currentUser: ctrlWrapper(currentUser),
};
