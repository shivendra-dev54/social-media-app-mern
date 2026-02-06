import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Comment } from "../db/schema/comment.model";
import { Post } from "../db/schema/post.model";
import { CustomRequest } from "../interfaces/CustomRequest";

export const createComment = asyncHandler(async (req, res) => {
  const { postId: postId } = req.params;
  const { content } = req.body;
  const author = (req as unknown as CustomRequest).user._id;

  if (!content) {
    return res.status(400).json(
      new ApiResponse(400, "comment content required.", false, null).toString()
    );
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json(
      new ApiResponse(404, "post not found.", false, null).toString()
    );
  }

  const comment = await Comment.create({
    post: postId,
    author,
    content,
    likes: [],
  });

  await Post.updateOne(
    { _id: postId },
    { $inc: { commentsCount: 1 } }
  );

  return res.status(201).json(
    new ApiResponse(201, "comment added.", true, comment).toString()
  );
});
