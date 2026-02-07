import * as jose from "jose";
import { IUser } from "../db/schema/user.model.js";

export const getAccessToken = async (user: IUser) => {
  const access_secret = new TextEncoder().encode(process.env.ACCESS_SECRET);
  const access_token = await new jose.SignJWT({
    _id: user._id,
    username: user.username,
    email: user.email
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(access_secret);
  return access_token;
}

