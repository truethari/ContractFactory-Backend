import express from "express";
import { loginSchema } from "../../../schema/auth.schema";
import sanitize from "../middlewares/sanitize.middleware";
import authController from "../controllers/auth.controller";
import validationSchema from "../middlewares/schema.middleware";

const router = express.Router();

router.post("/login", [sanitize, validationSchema(loginSchema)], authController.login);

export default router;
