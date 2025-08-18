import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import DeploymentsController from "../controllers/deployments.controller";

const deploymentsRouter = express.Router();

deploymentsRouter.get("/", authenticateToken, DeploymentsController.allDetails);
deploymentsRouter.post("/compile", authenticateToken, DeploymentsController.compile);

export default deploymentsRouter;
