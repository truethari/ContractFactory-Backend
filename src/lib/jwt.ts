import jwt from "jsonwebtoken";
import config from "../config";

export const generateJWT = (address: string): string => {
  return jwt.sign({ address, type: "wallet" }, config.secrets.jwt, { expiresIn: "24h" });
};
