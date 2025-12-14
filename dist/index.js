import express from "express";
import { config } from "./config/config";
import baseRoute from "./base_route/index.route";
import { errorHandlingMiddleware } from "./middleware/errorHandling.middleware";
const server = express();
server.use(express.json());
server.use(baseRoute);
server.use(errorHandlingMiddleware);
server.listen(config.PORT, "192.168.1.231", async () => {
    console.log(`server is running on http://localhost:${config.PORT}`);
});
