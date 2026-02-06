import * as jose from "jose";
import { IUser } from "../db/schema/user.model";

export const getRefreshToken = async (user: IUser) => {
  const refresh_secret = new TextEncoder().encode(process.env.REFRESH_SECRET);
  const refresh_token = await new jose.SignJWT({
    username: user.username,
    email: user.email
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(refresh_secret);
  return refresh_token;
}

