import config from "../config";
import type { CookieOptions } from "express";

const expiresInOneDay = 86400000;

export const getCookiesOptions = (): CookieOptions => {
  return {
    httpOnly: false,
    maxAge: expiresInOneDay,
    secure: config.api.env !== "development",
    path: "/",
    sameSite: config.api.env !== "development" ? "lax" : "lax",
    domain: config.api.env !== "development" ? config.api.cookieDomain : "localhost",
  };
};
