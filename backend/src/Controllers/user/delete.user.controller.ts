import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { User } from "../../db/schema/user.model.js";
import { Post } from "../../db/schema/post.model.js";
import { Comment } from "../../db/schema/comment.model.js";
import { deleteFromCloudinary } from "../../utils/cloudinary.js";
import { Request, Response } from "express";


export const deleteUserAccount = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as unknown as CustomRequest).user;
  const userId = user._id;

  const userPosts = await Post.find({ author: userId });

  const deleteImagePromises = userPosts.map((post) => {
    if (post.image) {
      const publicId = post.image.split("/").pop()?.split(".")[0];
      if (publicId) {
        return deleteFromCloudinary(publicId);
      }
    }
    return Promise.resolve();
  });

  await Promise.all(deleteImagePromises);

  if (user.avatar) {
    const publicId = user.avatar.split("/").pop()?.split(".")[0];
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
  }

  await Post.deleteMany({ author: userId });

  await Comment.deleteMany({ author: userId });

  const userPostIds = userPosts.map((p) => p._id);
  await Comment.deleteMany({ post: { $in: userPostIds } });

  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .clearCookie("access_token")
    .json(
      new ApiResponse(
        200,
        "User account and all associated data deleted successfully.",
        true,
        null
      ).toString()
    );
});