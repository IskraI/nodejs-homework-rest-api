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

// authRouter.post("/logout", authenticate, ctrl.logout);

// authRouter.patch(
//   "/",
//   authenticate,
//   validateBody(schemas.updateSubscriptionSchema),
//   ctrl.updateSubscriptionUser
// );

export default authRouter;
