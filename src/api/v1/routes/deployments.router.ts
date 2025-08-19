import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import DeploymentsController from "../controllers/deployments.controller";

const router = express.Router();

router.get("/", authenticateToken, DeploymentsController.allDetails);
router.post("/compile", authenticateToken, DeploymentsController.compile);
router.post("/:id/deploy", authenticateToken, DeploymentsController.deploy);
router.delete("/:id", authenticateToken, DeploymentsController.delete);

export default router;
