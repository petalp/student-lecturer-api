import express from "express";
import studentRoute from "../students/routes/student.routes";

const baseRoute = express.Router();

baseRoute.use("/api/v1/students", studentRoute);

export default baseRoute;
