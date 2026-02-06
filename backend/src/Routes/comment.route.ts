import { Router } from "express";
import { authMiddleware } from "../Middleware/auth.middleware";
import { createComment } from "../Controllers/create.comment.controller";
import { getCommentsByPost } from "../Controllers/get.comment.controller";
import { updateComment } from "../Controllers/update.comment.controller";
import { deleteComment } from "../Controllers/delete.comment.controller";
import { toggleCommentLike } from "../Controllers/toggleLike.comment.controller";
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
