import { Router } from "express";
import { authMiddleware } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";
import { getUserProfile } from "../Controllers/user/get.user.controller.js";
import { updateUserProfile } from "../Controllers/user/update.user.controller.js";
import { deleteUserAccount } from "../Controllers/user/delete.user.controller.js";

export const userRouter = Router(); 

userRouter
  .route("/api/user")
  .get(authMiddleware, getUserProfile)
  .patch(authMiddleware, upload.any(), updateUserProfile)
  .delete(authMiddleware, deleteUserAccount);