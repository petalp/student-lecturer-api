import express from "express";
import AuthController from "../AuthController/auth.controller.js";
import authenticate from "@middleware/authenticate.js";

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
 */
authRoute.post("/login", authController.login);

/**
 * @route POST /forgot-password
 * @desc request a password reset OTP via email
 * @access public
 */
authRoute.post("/forgot-password", authController.forgotPassword);

/**
 * @route POST /reset-password
 * @desc reset password using OTP received via email
 * @access public
 */
authRoute.post("/reset-password", authController.resetPassword);

/**
 * @route PUT /change-password
 * @desc change password for authenticated user (admin or student)
 * @access private
 */
authRoute.put("/change-password", authenticate, authController.changePassword);

export default authRoute;
