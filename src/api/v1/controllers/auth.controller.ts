import { generateJWT } from "../../../lib/jwt";
import { verifySignature } from "../../../utils/ethers";
import { getCookiesOptions } from "../../../utils/cookies";
import { HTTP_STATUS_CODE } from "../../../utils/constants";
import { SUCCESS_RESPONSE, ERROR_RESPONSE } from "../../../lib/customHandler";

import { createUserIfNotExists } from "../services/auth.service";

import type { Response, Request } from "express";

const authController = {
  login: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { message, address, signature } = req.body as {
        message: string;
        address: string;
        signature: string;
      };

      const isValidSignature = verifySignature(message, signature, address);
      if (!isValidSignature) {
        return ERROR_RESPONSE(
          res,
          false,
          HTTP_STATUS_CODE.UNAUTHORIZED_RESPONSE_CODE,
          "Invalid signature. Please sign the message with your wallet."
        );
      }

      await createUserIfNotExists(address);

      const token = generateJWT(address);
      res.cookie("jwtToken", token, getCookiesOptions());

      return SUCCESS_RESPONSE(
        res,
        true,
        HTTP_STATUS_CODE.CREATE_RESPONSE_CODE,
        {},
        "Login successful"
      );
    } catch (error) {
      console.error("Login error:", error);
      return ERROR_RESPONSE(
        res,
        false,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR_RESPONSE_CODE,
        "An error occurred during login."
      );
    }
  },
};

export default authController;
