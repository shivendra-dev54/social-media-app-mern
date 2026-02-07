import { User } from "../db/schema/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { checkPassword } from "../utils/checkPassword.js";
import { getAccessToken } from "../utils/getAccessToken.js";
import { getRefreshToken } from "../utils/getRefreshToken.js";
import { accessCookieOptions, refreshCookieOptions } from "../utils/cookiesOption.js";

export const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "unvalid email or password.",
          false,
          null
        ).toString()
      );
  }

  const userWithSameEmail = await User.findOne({ email }).select("+password");
  if (!userWithSameEmail) {
    return res
      .status(404)
      .json(
        new ApiResponse(
          404,
          "user does not exists.",
          false,
          null
        ).toString()
      );
  }

  const passCheck = await checkPassword(password, userWithSameEmail.password);
  if (!passCheck) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "password does not match.",
          false,
          null
        ).toString()
      );
  }


  const access_token = await getAccessToken(userWithSameEmail);
  const refresh_token = await getRefreshToken(userWithSameEmail);

  await User.updateOne(
    { _id: userWithSameEmail._id },
    { refresh_token }
  );

  return res
    .status(201)
    .cookie("access_token", access_token, accessCookieOptions)
    .cookie("refresh_token", refresh_token, refreshCookieOptions)
    .json(
      new ApiResponse(
        200,
        "successfully logged in.",
        true,
        {
          "_id": userWithSameEmail._id,
          "username": userWithSameEmail.username,
          "fullname": userWithSameEmail.fullname,
          "email": userWithSameEmail.email,
          "bio": userWithSameEmail.bio
        }
      ).toString()
    );
});