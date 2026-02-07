import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../db/schema/post.model.js";

export const getPosts = asyncHandler(async (_req, res) => {
  const posts = await Post.find()
    .populate("author", "username")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      "posts fetched successfully.",
      true,
      posts
    ).toString()
  );
});
