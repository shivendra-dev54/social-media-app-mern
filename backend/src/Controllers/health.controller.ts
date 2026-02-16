import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getHealth = asyncHandler(async (req, res) => {
  return res.status(201).json(
    new ApiResponse(
      201,
      "Server is running...",
      true,
      null
    ).toString()
  );
});
