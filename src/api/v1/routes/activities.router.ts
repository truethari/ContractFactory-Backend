import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import ActivitiesController from "../controllers/activities.controller";

const router = express.Router();

router.get("/", authenticateToken, ActivitiesController.getAllActivities);

export default router;
