//model
import User from "../models/user.js";

//ctrlWrapper -try catch, HttpError - error list
import { HttpError, ctrlWrapper, sendEmail } from "../helpers/index.js";

//hash password
import bcrypt from "bcryptjs";
//create avatar
import gravatar from "gravatar";

//create verificate code
import { nanoid } from "nanoid";

//create token
import jwt from "jsonwebtoken";
import "dotenv/config";
//files
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";

const { JWT_SECRET, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError("409", "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target = "_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
      avatarURL: result.avatarURL,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError("404", "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError("404", "User not found");
  }
  if (user.verify) {
    throw HttpError("400", "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target = "_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
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
  if (!user.verify) {
    throw HttpError("401", "Email not verify");
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

const avatarsPath = path.resolve("public", "avatars");

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(404, "Please add file ");
  }
  const { _id, avatarURL } = req.user;

  const { path: oldPath, originalname } = req.file;
  const filename = `${_id}_${originalname}`;

  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const oldFile = path.resolve("public", avatarURL);

  const resizeFile = await Jimp.read(newPath);
  await resizeFile.resize(250, 250).write(newPath);

  if (oldFile.includes("avatars")) {
    try {
      await fs.readFile(oldFile);
      await fs.unlink(oldFile);
    } catch (error) {
      console.log("error", error);
    }
  }
  const avatarNewURL = path.join("avatars", filename);

  const result = await User.findByIdAndUpdate(
    _id,
    { avatarURL: avatarNewURL },
    {
      new: true,
    }
  );

  res.json({ avatarURL: result.avatarURL });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  currentUser: ctrlWrapper(currentUser),
  logout: ctrlWrapper(logout),
  updateSubscriptionUser: ctrlWrapper(updateSubscriptionUser),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
