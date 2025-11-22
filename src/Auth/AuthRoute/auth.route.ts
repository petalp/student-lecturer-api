import express from "express";
import AuthController from "../AuthController/auth.controller";

const authController = new AuthController();
const authRoute = express.Router();

/**
 * @route POST /
 * @desc create admin
 * @access public
 */

authRoute.post("/", authController.createAdmin);

export default authRoute;
