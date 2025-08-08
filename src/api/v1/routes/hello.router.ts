import express from "express";
import helloController from "../controllers/hello.controller";

const helloRouter = express.Router();

/**
 * @swagger
 * /api/v1/hello:
 *   get:
 *     summary: Returns a Hello World message
 *     tags:
 *       - Hello Endpoints
 *     responses:
 *       201:
 *         description: Hello World message successfully returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                       example: Hello World
 *                 message:
 *                   type: string
 *                   example: Hello World
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 error:
 *                   type: string
 */
helloRouter.get("/", helloController.hello);

export default helloRouter;
