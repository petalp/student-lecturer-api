import { Request, Response } from "express";
import { InputDataError } from "../../error/CustomError";
import {
  ICreateStudent,
  IPaginationOptions,
  IStudentController,
} from "../../types/student";
import StudentService from "../services/student.service";

const studentServices = new StudentService();

class StudentController implements IStudentController {
  async createStudentController(req: Request, res: Response): Promise<void> {
    if (!req.body) {
      throw new InputDataError({
        message: "no data provided",
        statusCode: 400,
        code: "NO_DATA",
      });
    }
    const createStudent: ICreateStudent = req.body;
    const student = await studentServices.createStudent(createStudent);
    res.status(201).json({
      status: "success",
      data: student,
    });
  }

  async getStudentsController(req: Request, res: Response): Promise<void> {
    const params: IPaginationOptions = req.query;
    const students = await studentServices.getAllStudents(params);
    res.status(200).json({
      status: "success",
      data: students,
    });
  }

  async getStudentByIdController(req: Request, res: Response): Promise<void> {
    if (!req.params.id) {
      throw new InputDataError({
        message: "student ID is required",
        statusCode: 400,
        code: "NO_DATA",
      });
    }
    const studentId: number = parseInt(req.params.id);
    const student = await studentServices.getStudentById(studentId);
    res.status(200).json({
      status: "success",
      data: student,
    });
  }

  async updateStudentController(req: Request, res: Response): Promise<void> {
    if (!req.body) {
      throw new InputDataError({
        message: "no data provided",
        statusCode: 400,
        code: "NO_DATA",
      });
    }
    const studentId: number = parseInt(req.params.id);
    const studentUpdateData: Partial<ICreateStudent> = req.body;
    const updatedStudent = await studentServices.updateStudent(
      studentId,
      studentUpdateData
    );
    res.status(200).json({
      status: "success",
      data: updatedStudent,
    });
  }

  async deleteStudentController(req: Request, res: Response): Promise<void> {}

  async getStudentsByDepartmentController(
    req: Request,
    res: Response
  ): Promise<void> {}
}

export default StudentController;
