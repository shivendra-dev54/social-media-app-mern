import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { CustomRequest } from "../../interfaces/CustomRequest.js";
import { Request, Response } from "express";


export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as unknown as CustomRequest).user;

  return res.status(200).json(
    new ApiResponse(
      200,
      "User profile fetched successfully.",
      true,
      user
    ).toString()
  );
});
