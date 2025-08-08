import { type Response } from "express";

/**
 * Handles a successful API response.
 *
 * @param {Response} res - The response object to send the response with.
 * @param {boolean} status - send true or false in the response.
 * @param {number} statusCode - The HTTP status code to send in the response.
 * @param {*} data - The data to include in the response.
 * @param {string | object} message - The message to include in the response.
 * @param {string | null | undefined} redirect - Optional redirection URL.
 * @param {object | undefined} pagination - Optional pagination data.
 * @returns {Response}
 */
export const SUCCESS_RESPONSE = (
  res: Response,
  status: boolean,
  statusCode: number,
  data: object | undefined,
  message: string | object,
  pagination?: object
): Response => {
  return res.status(statusCode).json({
    status,
    data,
    message,
    pagination,
  });
};

/**
 * Handles an error API response.
 *
 * @param {Response} res - The response object to send the response with.
 * @param {boolean} status - send true or false in the response.
 * @param {number} statusCode - The HTTP status code to send in the response.
 * @param {string} message - The error message to include in the response.
 * @returns {Response}
 */
export const ERROR_RESPONSE = (
  res: Response,
  status: boolean,
  statusCode: number,
  message: string | object
): Response => {
  return res.status(statusCode).json({ status, error: message });
};

/**
 * Redirects the user to a different page.
 *
 * @param {Response} res - The response object to send the response with.
 * @param {string} path - The path to redirect the user to.
 * @returns {Response}
 */
export const REDIRECT_RESPONSE = (res: Response, path: string): Response => {
  return res.status(200).json({ status: true, redirect: path });
};
