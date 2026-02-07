import { Comment } from "../db/schema/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCommentsByPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .populate("author", "username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, "comments fetched.", true, comments).toString()
  );
});
