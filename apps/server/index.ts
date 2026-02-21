import express from "express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerConfig } from "./src/config/swagger.config.ts";
import swaggerUi from "swagger-ui-express";
import { env } from "./src/libs/validate-env.ts";
import { router } from "./src/routes/index.route.ts";
import morgan from "morgan";
import { zodMiddleware } from "./src/middleware/zod.middleware.ts";
const app = express();
const swagger = swaggerJsdoc(swaggerConfig);

app.use(express.json());
app.use(morgan("combined"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swagger));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["*"],
    credentials: true,
  }),
);
app.use("/api/v1", router);
app.use(zodMiddleware);
app.listen(env.PORT, () => {
  console.log(`Example app test listening on port ${env.PORT}`);
});
