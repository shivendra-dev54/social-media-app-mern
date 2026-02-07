import { Router } from "express";
import { createPost } from "../Controllers/createPost.controller.js";
import { getPosts } from "../Controllers/getPosts.controller.js";
import { deletePost } from "../Controllers/deletePost.controller.js";
import { updatePost } from "../Controllers/updatePost.controller.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";
import { togglePostLike } from "../Controllers/togglePostLike.controller.js";
import { getPost } from "../Controllers/getPost.controller.js";

export const postRouter = Router();

postRouter
  .route("/api/post")
  .post(authMiddleware, upload.single("image"), createPost)
  .get(getPosts);

postRouter
  .route("/api/post/:id")
  .patch(authMiddleware, upload.any(), updatePost)
  .delete(authMiddleware, deletePost)
  .get(getPost);

postRouter
  .route("/api/post/:id/like")
  .patch(authMiddleware, togglePostLike);

