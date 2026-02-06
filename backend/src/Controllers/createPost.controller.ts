import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { CustomRequest } from "../interfaces/CustomRequest";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { IPost, Post } from "../db/schema/post.model";

export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const imagepath = (req as unknown as CustomRequest).file?.path;
  const author = (req as unknown as CustomRequest).user._id;

  if (!content && !imagepath) {
    return res.status(400).json(
      new ApiResponse(
        400,
        "post must have content or image.",
        false,
        null
      ).toString()
    );
  }

  let imageUrl: string | undefined;

  if (imagepath) {
    const image = await uploadOnCloudinary(imagepath);

    if (!image?.url) {
      return res.status(400).json(
        new ApiResponse(
          400,
          "unable to upload image.",
          false,
          null
        ).toString()
      );
    }

    imageUrl = image.url;
  }

  const post: IPost = await Post.create({
    author,
    content,
    image: imageUrl,
    likes: [],
    commentsCount: 0,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "posted successfully.",
      true,
      post
    ).toString()
  );
});
