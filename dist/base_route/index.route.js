import express from "express";
import studentRoute from "../students/routes/student.routes.js";
import authRoute from "../Auth/AuthRoute/auth.route.js";
const baseRoute = express.Router();
baseRoute.use("/api/v1/students", studentRoute);
baseRoute.use("/api/v1/auth", authRoute);
export default baseRoute;
