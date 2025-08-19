import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";

import config, { swaggerSpec } from "./config";

import authRouter from "./api/v1/routes/auth.router";
import activitiesRouter from "./api/v1/routes/activities.router";
import deploymentsRouter from "./api/v1/routes/deployments.router";

import type { Express } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user: { address: string };
  }
}

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/activities", activitiesRouter);
app.use("/api/v1/deployments", deploymentsRouter);

export function runApp(): void {
  try {
    app.listen(config.api.port, () => {
      console.log(`[server]: Server is running at: ${config.api.port}`);
      console.log(`[server]: Docs are available at http://localhost:${config.api.port}/docs`);
    });
  } catch (error: unknown) {
    console.log(error);
    console.log("[server]: Server failed to start");
  }
}
