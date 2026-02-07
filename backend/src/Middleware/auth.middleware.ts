import { Request, Response, NextFunction } from "express";
import * as jose from "jose";
import { User } from "../db/schema/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";

interface AccessTokenPayload {
  _id: string;
  username: string;
  email: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json(
        new ApiResponse(401, "unauthorized.", false, null).toString()
      );
    }

    const secret = new TextEncoder().encode(process.env.ACCESS_SECRET);

    const { payload } = await jose.jwtVerify<AccessTokenPayload>(
      token,
      secret
    );

    const user = await User.findOne({username: payload.username});

    if (!user) {
      return res.status(401).json(
        new ApiResponse(401, "user not found.", false, null).toString()
      );
    }

    (req as unknown as CustomRequest).user = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json(
      new ApiResponse(401, "invalid or expired token.", false, null).toString()
    );
  }
};
