import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../db/schema/post.model.js";

export const getPost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params as { id: string };

  const posts = await Post.findOne({ _id: postId })
    .populate("author", "username");

  return res.status(200).json(
    new ApiResponse(
      200,
      "posts fetched successfully.",
      true,
      posts
    ).toString()
  );
});
