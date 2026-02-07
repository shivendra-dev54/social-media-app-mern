import { IUser, User } from "../db/schema/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { hashPassword } from "../utils/hashPassword.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const signup = asyncHandler(async (req, res) => {
  const { fullname, username, bio, email, password } = req.body;

  if (!fullname || !username || !email || !password) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "unvalid name or email.",
          false,
          null
        ).toString()
      );
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res
      .status(409)
      .json(
        new ApiResponse(
          409,
          "user already exists.",
          false,
          null
        ).toString()
      );
  }

  const hashedPassword = await hashPassword(password);

  const user: IUser = await User.create({
    username,
    fullname,
    bio,
    email,
    password: hashedPassword,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        "successfully created user.",
        true,
        null
      ).toString()
    );
});