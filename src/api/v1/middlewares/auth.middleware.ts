import jwt from "jsonwebtoken";

import config from "../../../config";
import { ERROR_RESPONSE } from "../../../lib/customHandler";
import { HTTP_STATUS_CODE } from "../../../utils/constants";

import type { Request, Response, NextFunction } from "express";

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | undefined => {
  const cookiesToken = req.cookies.jwtToken as string;

  if (!cookiesToken) {
    return ERROR_RESPONSE(
      res,
      false,
      HTTP_STATUS_CODE.UNAUTHORIZED_RESPONSE_CODE,
      "No token provided. Please provide a valid JWT token in the Authorization header."
    );
  }

  jwt.verify(cookiesToken, config.secrets.jwt, (err, decoded) => {
    if (err) {
      return ERROR_RESPONSE(
        res,
        false,
        HTTP_STATUS_CODE.UNAUTHORIZED_RESPONSE_CODE,
        "Invalid token. Please provide a valid JWT token."
      );
    }
    req.user = decoded as string;
    next();
  });
};

export default authenticateToken;
