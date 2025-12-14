import { InputDataError } from "../../error/CustomError";
import StudentService from "../services/student.service";
const studentServices = new StudentService();
class StudentController {
    async createStudentController(req, res) {
        if (!req.body) {
            throw new InputDataError({
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
            throw new InputDataError({
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
            throw new InputDataError({
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
            throw new InputDataError({
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
export default StudentController;
