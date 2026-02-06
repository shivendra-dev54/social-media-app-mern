import { IUser, User } from "../db/schema/user.model";
import { asyncHandler } from "../utils/asyncHandler"
import { hashPassword } from "../utils/hashPassword";
import { ApiResponse } from "../utils/ApiResponse";

export const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
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