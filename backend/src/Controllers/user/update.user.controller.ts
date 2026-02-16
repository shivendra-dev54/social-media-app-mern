import { Request, Response } from "express";
import { User } from "../../db/schema/user.model.js";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { fullname, bio } = req.body;
  const user = (req as unknown as CustomRequest).user;

  if (!fullname && !bio && !(req.files || req.file)) {
    return res.status(400).json(
      new ApiResponse(
        400,
        "At least one field (fullname, bio, or avatar) is required to update.",
        false,
        null
      ).toString()
    );
  }

  const updates: any = {};
  if (fullname) updates.fullname = fullname;
  if (bio) updates.bio = bio;

  let avatarLocalPath;
  
  if (req.file) {
      avatarLocalPath = req.file.path;
  } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      avatarLocalPath = (req.files as Express.Multer.File[])[0].path;
  }

  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (avatar?.url) {
      updates.avatar = avatar.url;
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password -refresh_token");

  if (!updatedUser) {
     return res.status(500).json(
      new ApiResponse(
        500,
        "Failed to update user profile.",
        false,
        null
      ).toString()
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      "User profile updated successfully.",
      true,
      updatedUser
    ).toString()
  );
});