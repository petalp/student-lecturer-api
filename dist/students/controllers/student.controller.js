"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = require("../../error/CustomError");
const student_service_1 = __importDefault(require("../services/student.service"));
const studentServices = new student_service_1.default();
class StudentController {
    async createStudentController(req, res) {
        if (!req.body) {
            throw new CustomError_1.InputDataError({
                message: "no data provided",
                statusCode: 400,
                code: "NO_DATA",
            });
        }
        const createStudent = req.body;
        const student = await studentServices.createStudent(createStudent);
        res.status(201).json({
            status: "success",
            data: student,
        });
    }
    async getStudentsController(req, res) {
        const params = req.query;
        const students = await studentServices.getAllStudents(params);
        res.status(200).json({
            status: "success",
            data: students,
        });
    }
    async getStudentByIdController(req, res) {
        if (!req.params.id) {
            throw new CustomError_1.InputDataError({
                message: "student ID is required",
                statusCode: 400,
                code: "NO_DATA",
            });
        }
        const studentId = parseInt(req.params.id);
        const student = await studentServices.getStudentById(studentId);
        res.status(200).json({
            status: "success",
            data: student,
        });
    }
    async updateStudentController(req, res) {
        if (!req.body) {
            throw new CustomError_1.InputDataError({
                message: "no data provided",
                statusCode: 400,
                code: "NO_DATA",
            });
        }
        const studentId = parseInt(req.params.id);
        const studentUpdateData = req.body;
        const updatedStudent = await studentServices.updateStudent(studentId, studentUpdateData);
        res.status(200).json({
            status: "success",
            data: updatedStudent,
        });
    }
    async deleteStudentController(req, res) {
        if (!req.params.id) {
            throw new CustomError_1.InputDataError({
                message: "no user id ",
                statusCode: 400,
                code: "NO_DATA",
            });
        }
        const studentId = parseInt(req.params.id);
        await studentServices.deleteStudent(studentId);
        res.status(200).json({ message: "student is deleted successfully" });
    }
    async getStudentsByDepartmentController(req, res) {
        const deptName = req.query;
        const students = await studentServices.getStudentByDepartment(deptName);
        res.status(200).json({
            status: "success",
            data: students,
        });
    }
}
exports.default = StudentController;
