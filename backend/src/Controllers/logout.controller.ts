import { User } from "../db/schema/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

export const logout = asyncHandler(async (req, res) => {
  const refresh_token = req.cookies.refresh_token;

  if (refresh_token) {
    await User.updateOne(
      { refresh_token },
      { $unset: { refresh_token: "" } }
    );
  }

  return res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .status(200)
    .json(
      new ApiResponse(
        200,
        "logged out successfully.",
        true,
        null
      ).toString()
    );
});
