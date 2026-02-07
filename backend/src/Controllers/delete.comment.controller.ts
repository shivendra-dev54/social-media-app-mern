import { Comment } from "../db/schema/comment.model.js";
import { Post } from "../db/schema/post.model.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = (req as unknown as CustomRequest).user._id;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(404).json(
      new ApiResponse(404, "comment not found.", false, null).toString()
    );
  }

  if (comment.author.toString() !== userId!.toString()) {
    return res.status(403).json(
      new ApiResponse(403, "not allowed.", false, null).toString()
    );
  }

  await Comment.findByIdAndDelete(commentId);

  await Post.updateOne(
    { _id: comment.post },
    { $inc: { commentsCount: -1 } }
  );

  return res.status(200).json(
    new ApiResponse(200, "comment deleted.", true, null).toString()
  );
});
