import { User } from "../db/schema/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hashPassword } from "../utils/hashPassword.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const signup = asyncHandler(async (req, res) => {
  const { fullname, username, bio, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "Username, email, and password are required.",
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
        new ApiResponse(409, "User already exists.", false, null).toString()
      );
  }

  const hashedPassword = await hashPassword(password);

  await User.create({
    username,
    fullname: fullname || username,
    bio: bio || "",
    email,
    password: hashedPassword,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Successfully created user.",
        true,
        null
      ).toString()
    );
});