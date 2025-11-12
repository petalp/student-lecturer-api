import express from "express";
import StudentController from "../controllers/student.controller";

const studentController = new StudentController();

const studentRoute = express.Router();

/**
 * @route POST /students
 * @desc Create a new student
 * @access public
 */

studentRoute.post("/", studentController.createStudentController);

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
 * @route PUT /:id
 * @desc update student by ID
 * @access public
 */
studentRoute.put("/:id", studentController.updateStudentController);

export default studentRoute;
