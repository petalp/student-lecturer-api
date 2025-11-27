import express from "express";
import { config } from "./config/config";
import { connectDatabase } from "./config/database";
import baseRoute from "./base_route/index.route";
import { errorHandlingMiddleware } from "./middleware/errorHandling.middleware";

const server = express();

server.use(express.json());

//health check

server.use(baseRoute);
// server.use(errorHandlingMiddleware);

server.listen(config.PORT, "0.0.0.0", async () => {
  await connectDatabase();
  console.log(`server is running on http://localhost:${config.PORT}`);
});
