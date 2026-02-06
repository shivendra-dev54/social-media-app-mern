import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Post } from "../db/schema/post.model";
import { CustomRequest } from "../interfaces/CustomRequest";

export const togglePostLike = asyncHandler(async (req, res) => {
  const { id: postId } = req.params as { id: string };
  const userId = (req as unknown as CustomRequest).user._id;

  const post = await Post.findById(postId);

  if (!post) {
    console.log(postId);
    return res.status(404).json(
      new ApiResponse(404, "post not found.", false, null).toString()
    );
  }

  const alreadyLiked = post.likes.some(
    (id) => id.toString() === userId!.toString()
  );

  if (alreadyLiked) {
    await Post.updateOne(
      { _id: postId },
      { $pull: { likes: userId } }
    );

    return res.status(200).json(
      new ApiResponse(200, "post unliked.", true, null).toString()
    );
  }

  await Post.updateOne(
    { _id: postId },
    { $addToSet: { likes: userId } }
  );

  return res.status(200).json(
    new ApiResponse(200, "post liked.", true, null).toString()
  );
});
