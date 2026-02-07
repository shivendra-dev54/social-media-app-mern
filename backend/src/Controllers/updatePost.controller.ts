import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../db/schema/post.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";

export const updatePost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params as { id: string };
  const { content } = req.body;
  const newImagePath = (req as unknown as CustomRequest).file?.path;
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

  let newImageUrl: string | undefined;
  const oldImageUrl = post.image;

  if (newImagePath) {
    const uploaded = await uploadOnCloudinary(newImagePath);

    if (!uploaded?.url) {
      return res.status(400).json(
        new ApiResponse(400, "image upload failed.", false, null).toString()
      );
    }

    newImageUrl = uploaded.url;
  }

  post.content = content ?? post.content;
  post.image = newImageUrl ?? post.image;

  const updatedPost = await post.save();

  if (newImageUrl && oldImageUrl) {
    const publicId = oldImageUrl.split("/").pop()?.split(".")[0];
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
  }

  return res.status(200).json(
    new ApiResponse(200, "post updated successfully.", true, updatedPost).toString()
  );
});
