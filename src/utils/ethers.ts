import Joi from "joi";
import { ethers } from "ethers";

export const ethAddressSchema = Joi.string()
  .custom((value, helpers) => {
    if (!ethers.isAddress(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }, "Ethereum Address Validation")
  .required();

export const isAddressSame = (address1: string, address2: string): boolean => {
  if (!address1 || !address2) return false;
  return address1.toLowerCase() === address2.toLowerCase();
};

export const verifySignature = (
  message: string,
  signature: string,
  expectedAddress: string
): boolean => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return isAddressSame(recoveredAddress, expectedAddress);
  } catch {
    return false;
  }
};
