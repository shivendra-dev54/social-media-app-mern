import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Post } from "../db/schema/post.model";

export const getPosts = asyncHandler(async (_req, res) => {
  const posts = await Post.find()
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
