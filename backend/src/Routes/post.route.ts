import { Router } from "express";
import { createPost } from "../Controllers/createPost.controller";
import { getPosts } from "../Controllers/getPosts.controller";
import { deletePost } from "../Controllers/deletePost.controller";
import { updatePost } from "../Controllers/updatePost.controller";
import { authMiddleware } from "../Middleware/auth.middleware";
import { upload } from "../Middleware/multer.middleware";
import { togglePostLike } from "../Controllers/togglePostLike.controller";

export const postRouter = Router();

postRouter
  .route("/api/post")
  .post(authMiddleware, upload.single("image"), createPost)
  .get(getPosts);

postRouter
  .route("/api/post/:id")
  .patch(authMiddleware, upload.single("image"), updatePost)
  .delete(authMiddleware, deletePost);

postRouter
  .route("/api/post/:id/like")
  .patch(authMiddleware, togglePostLike);

