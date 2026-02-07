import { Comment } from "../db/schema/comment.model.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = (req as unknown as CustomRequest).user._id;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json(
      new ApiResponse(404, "comment not found.", false, null).toString()
    );
  }

  const liked = comment.likes.some(
    (id) => id.toString() === userId!.toString()
  );

  await Comment.updateOne(
    { _id: commentId },
    liked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      liked ? "comment unliked." : "comment liked.",
      true,
      null
    ).toString()
  );
});
