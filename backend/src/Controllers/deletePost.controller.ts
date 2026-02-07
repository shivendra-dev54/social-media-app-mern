import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../db/schema/post.model.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";

export const deletePost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params as { id: string };
  const userId = (req as unknown as CustomRequest).user._id;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json(
      new ApiResponse(404, "post not found.", false, null).toString()
    );
  }

  if (post.author.toString() !== userId!.toString()) {
    return res.status(403).json(
      new ApiResponse(403, "not allowed.", false, null).toString()
    );
  }

  if (post.image) {
    const publicId = post.image.split("/").pop()?.split(".")[0];
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
  }

  await Post.findByIdAndDelete(postId);

  return res.status(200).json(
    new ApiResponse(
      200,
      "post deleted successfully.",
      true,
      null
    ).toString()
  );
});
