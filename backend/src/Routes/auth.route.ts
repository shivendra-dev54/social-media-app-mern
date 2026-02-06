import { Router } from "express";
import { signup } from "../Controllers/signup.controller";
import { signin } from "../Controllers/signin.controller";
import { refresh } from "../Controllers/refresh.controller";
import { logout } from "../Controllers/logout.controller";

const authRouter = Router();

authRouter.route("/api/auth/signup").post(signup);
authRouter.route("/api/auth/signin").post(signin);
authRouter.route("/api/auth/refresh").post(refresh);
authRouter.route("/api/auth/logout").post(logout);

export {
  authRouter
};