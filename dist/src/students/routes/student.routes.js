"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const student_controller_1 = __importDefault(require("@student/controllers/student.controller"));
const authenticate_1 = __importDefault(require("@/middleware/authenticate"));
const authorize_1 = __importDefault(require("@/middleware/authorize"));
const studentController = new student_controller_1.default();
const studentRoute = express_1.default.Router();
/**
 * @route POST /students
 * @desc Create a new student
 * @access public
 */
studentRoute.post("/", authenticate_1.default, authorize_1.default, studentController.createStudentController);
/**
 * @route GET /students
 * @desc get all students with pagination
 * @access public
 */
studentRoute.get("/", studentController.getStudentsController);
/**
 * @route GET /:id
 * @description get student by ID
 * @access public
 */
studentRoute.get("/:id", studentController.getStudentByIdController);
/**
 * @route PATCH /:id
 * @desc update student by ID
 * @access public
 */
studentRoute.put("/:id", studentController.updateStudentController);
/**
 * @route DELETE /:id
 * @desc delete student by ID
 * @access public
 */
studentRoute.delete("/:id", studentController.deleteStudentController);
/**
 * @route GET /departments
 * @desc get students by department
 * @access public
 */
studentRoute.get("/department", studentController.getStudentsByDepartmentController);
exports.default = studentRoute;
