import express from "express";
import StudentController from "../controllers/student.controller";
import authenticate from "../../middleware/authenticate";
import authorize from "../../middleware/authorize";

const studentController = new StudentController();

const studentRoute = express.Router();

/**
 * @route POST /students
 * @desc Create a new student
 * @access public
 */

studentRoute.post(
  "/",
  authenticate,
  authorize,
  studentController.createStudentController
);

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

studentRoute.get(
  "/department",
  studentController.getStudentsByDepartmentController
);

export default studentRoute;
