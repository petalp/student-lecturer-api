import { Request, Response } from "express";

export interface ICreateStudent {
  first_name: string;
  middle_name?: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  sex: string;
  role: Role;
  level: number;
  studentId: number;
  facultyName: string;
  deptName: string;
  userId: number;
}

export interface IStudentResponse {
  student_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  sex: string;
  role: Role;
  updateAt: Date;
  createAt: Date;
}

export interface IStudent {
  level: number;
  studentId: number;
  facultyName: string;
  deptName: string;
  userId: number;
}

export interface IPaginationOptions {
  page?: string;
  cursor?: string;
}

export interface IPagination {
  nextCursor?: number;
  prevCursor?: number;
  pageSize: number;
  currentCount: number;
  hasMore: boolean;
  totalCount: number;
}

export interface IPaginatedResult<T> {
  data: T[];
  pagination: IPagination;
}

export interface IStudentService {
  createStudent(student: ICreateStudent): Promise<IStudent>;
  getAllStudents(
    params: IPaginationOptions
  ): Promise<IPaginatedResult<IStudent>>;
  updateStudent(
    studentId: number,
    studentUpdateData: Partial<ICreateStudent>
  ): Promise<IStudent>;
  deleteStudent(studentId: number): Promise<void>;
  getStudentById(stu_id: number): Promise<IStudent>;
  getStudentByDepartment(deptName: string): Promise<IStudent[]>;
}

export interface IStudentController {
  createStudentController(req: Request, res: Response): Promise<void>;
  getStudentsController(req: Request, res: Response): Promise<void>;
  getStudentByIdController(req: Request, res: Response): Promise<void>;
  updateStudentController(req: Request, res: Response): Promise<void>;
  deleteStudentController(req: Request, res: Response): Promise<void>;
  getStudentsByDepartmentController(req: Request, res: Response): Promise<void>;
}
