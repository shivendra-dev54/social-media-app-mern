import { Comment } from "../db/schema/comment.model";
import { CustomRequest } from "../interfaces/CustomRequest";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
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

  comment.content = content ?? comment.content;
  await comment.save();

  return res.status(200).json(
    new ApiResponse(200, "comment updated.", true, comment).toString()
  );
});
