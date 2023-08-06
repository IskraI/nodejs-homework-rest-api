//model
import User from "../models/user.js";

//ctrlWrapper -try catch, HttpError - error list
import { HttpError, ctrlWrapper } from "../helpers/index.js";

//hash password
import bcrypt from "bcryptjs";
//create avatar
import gravatar from "gravatar";

//create token
import jwt from "jsonwebtoken";
import "dotenv/config";
//files
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";

const { JWT_SECRET } = process.env;

const avatarsPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError("409", "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  // console.log("avatarURL", avatarURL);

  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
      avatarURL: result.avatarURL,
    },
  });
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

  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const currentUser = (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const updateSubscriptionUser = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  res.json(result);
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(404, "Please add file for upload");
  }
  const { _id } = req.user;

  const { path: oldPath, originalname } = req.file;
  const filename = `${_id}_${originalname}`;

  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);

  const resizeFile = await Jimp.read(newPath);
  await resizeFile.resize(250, 250).write(newPath);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({
    avatarURL,
  });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  currentUser: ctrlWrapper(currentUser),
  logout: ctrlWrapper(logout),
  updateSubscriptionUser: ctrlWrapper(updateSubscriptionUser),
  updateAvatar: ctrlWrapper(updateAvatar),
};
