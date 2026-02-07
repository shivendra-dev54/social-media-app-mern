import { Router } from "express";
import { authMiddleware } from "../Middleware/auth.middleware.js";
import { createComment } from "../Controllers/create.comment.controller.js";
import { getCommentsByPost } from "../Controllers/get.comment.controller.js";
import { updateComment } from "../Controllers/update.comment.controller.js";
import { deleteComment } from "../Controllers/delete.comment.controller.js";
import { toggleCommentLike } from "../Controllers/toggleLike.comment.controller.js";
export const commentRouter = Router();

commentRouter.post(
  "/api/post/:postId/comment",
  authMiddleware,
  createComment
);

commentRouter.get(
  "/api/post/:postId/comments",
  getCommentsByPost
);

commentRouter.patch(
  "/api/comment/:commentId",
  authMiddleware,
  updateComment
);

commentRouter.delete(
  "/api/comment/:commentId",
  authMiddleware,
  deleteComment
);

commentRouter.patch(
  "/api/comment/:commentId/like",
  authMiddleware,
  toggleCommentLike
);
