import { Router } from "express";
import { signup } from "../Controllers/signup.controller.js";
import { signin } from "../Controllers/signin.controller.js";
import { refresh } from "../Controllers/refresh.controller.js";
import { logout } from "../Controllers/logout.controller.js";

const authRouter = Router();

authRouter.route("/api/auth/signup").post(signup);
authRouter.route("/api/auth/signin").post(signin);
authRouter.route("/api/auth/refresh").post(refresh);
authRouter.route("/api/auth/logout").post(logout);

export {
  authRouter
};