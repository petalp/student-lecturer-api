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

/**
 * @route POST /login
 * @desc login users
 * @access public
 *
 */
authRoute.post("/login", authController.login);
export default authRoute;
