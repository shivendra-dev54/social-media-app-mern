import * as jose from "jose";
import { User } from "../db/schema/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getAccessToken } from "../utils/getAccessToken.js";
import { getRefreshToken } from "../utils/getRefreshToken.js";
import {
  refreshCookieOptions,
  accessCookieOptions,
} from "../utils/cookiesOption.js";

interface RefreshTokenPayload {
  username: string;
  email: string;
}

export const refresh = asyncHandler(async (req, res) => {
  const refresh_token = req.cookies?.refresh_token;

  if (!refresh_token) {
    return res.status(401).json(
      new ApiResponse(401, "refresh token missing.", false, null).toString()
    );
  }

  let payload: RefreshTokenPayload;

  try {
    const secret = new TextEncoder().encode(process.env.REFRESH_SECRET);

    const verified = await jose.jwtVerify<RefreshTokenPayload>(
      refresh_token,
      secret
    );

    payload = verified.payload;
  } catch {
    return res.status(401).json(
      new ApiResponse(401, "invalid refresh token.", false, null).toString()
    );
  }

  const user = await User.findOne({
    username: payload.username,
    refresh_token,
  });

  if (!user) {
    return res.status(401).json(
      new ApiResponse(401, "refresh token expired.", false, null).toString()
    );
  }

  const newAccessToken = await getAccessToken(user);
  const newRefreshToken = await getRefreshToken(user);

  user.refresh_token = newRefreshToken;
  await user.save();

  return res
    .status(200)
    .cookie("access_token", newAccessToken, accessCookieOptions)
    .cookie("refresh_token", newRefreshToken, refreshCookieOptions)
    .json(
      new ApiResponse(
        200,
        "token refreshed.",
        true,
        null
      ).toString()
    );
});
