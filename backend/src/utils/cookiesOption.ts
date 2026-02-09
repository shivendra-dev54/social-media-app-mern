import type { CookieOptions } from "express";

export const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  partitioned: true,
  maxAge: 60 * 60 * 1000,
  path: "/",
};

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  partitioned: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};
