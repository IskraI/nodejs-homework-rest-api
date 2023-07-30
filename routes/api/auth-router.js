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

export default authRouter;
