import express from "express";
import { config } from "./config/config.js";
import baseRoute from "./base_route/index.route.js";
import { errorHandlingMiddleware } from "./middleware/errorHandling.middleware.js";
const server = express();
server.use(express.json());
server.get("/health-check", (req, res) => {
    res.status(200).json({ message: "server is healthy" });
});
server.use(baseRoute);
server.use(errorHandlingMiddleware);
server.listen(config.PORT, "0.0.0.0", () => {
    console.log(`server is running on http://192.168.1.231:${config.PORT}`);
});
