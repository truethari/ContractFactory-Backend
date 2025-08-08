import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();

const config = {
  api: {
    env: process.env.NODE_ENV ?? "development",
    port: process.env.PORT ?? 3000,
  },

  swagger: {
    projectName: "Swagger",
    apiBaseURL: process.env.API_BASE_URL ?? "",
  },

  redis: {
    disable: !process.env.REDIS_URI,
    uri: process.env.REDIS_URI ?? "redis://localhost:6379",
  },
};

export const checkEnv = (name: string, value: string | null | undefined): void => {
  if (!value?.length) throw new Error(`${name} is not provided`);
};

export default config;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: `${config.swagger.projectName} API`,
      version: "1.0.0",
    },
    servers: [{ url: `http://localhost:${config.api.port}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/api/v1/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
