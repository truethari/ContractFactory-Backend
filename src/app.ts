import cors from "cors";
import helmet from "helmet";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";

import config, { swaggerSpec } from "./config";
import helloRouter from "./api/v1/routes/hello.router";

import type { Express } from "express";

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use("/api/v1/hello", helloRouter);

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
