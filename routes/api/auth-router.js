import express from "express";

import validation from "../../middlewares/index.js";
import usersSchemas from "../../schemas/users-schemas.js";
import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validation.isEmptyBody,
  validation.validateBody(usersSchemas.userRegisterSchema),
  authController.register
);

authRouter.get("/verify/:verificationToken", authController.verifyEmail);
authRouter.post(
  "/verify/",
  validation.validateBody(usersSchemas.emailSchema),
  authController.resendVerifyEmail
);

authRouter.post(
  "/login",
  validation.isEmptyBody,
  validation.validateBody(usersSchemas.userLoginSchema),
  authController.login
);

authRouter.get("/current", validation.authenticate, authController.currentUser);

authRouter.post("/logout", validation.authenticate, authController.logout);

authRouter.patch(
  "/",
  validation.authenticate,
  validation.validateBody(usersSchemas.updateSubscriptionSchema),
  authController.updateSubscriptionUser
);

authRouter.patch(
  "/avatars",
  validation.authenticate,
  validation.upload.single("avatar"),
  authController.updateAvatar
);

export default authRouter;
