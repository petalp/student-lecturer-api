import {
  ICreateStudent,
  IPaginatedResult,
  IPaginationOptions,
  IStudent,
  IStudentService,
} from "../../types/student";
import { PrismaClient } from "../../generated/prisma/client";
import { EntityExistError, EntityNotFound } from "../../error/CustomError";
import PasswordUtils from "../../utils/passwordUtils";

const prisma = new PrismaClient();

class StudentService implements IStudentService {
  async createStudent(student: ICreateStudent): Promise<IStudent> {
    const checkExistingUser = await prisma.user.findUnique({
      where: { email: student.email },
    });
    if (checkExistingUser) {
      throw new EntityExistError({
        message: `user with ${student.email} already exist`,
        statusCode: 409,
        code: "ENT_EXT",
      });
    }
    const hashPassword = await PasswordUtils.hashPassword(student.password);

    const studentInfo = await prisma.student.create({
      data: {
        level: student.level,
        deptName: student.deptName,
        facultyName: student.facultyName,
        studentId: student.studentId,
        user: {
          create: {
            firstName: student.first_name,
            middleName: student.middle_name,
            lastName: student.last_name,
            username: student.username,
            password: hashPassword,
            email: student.email,
            role: student.role,
            sex: student.sex,
          },
        },
      },
      include: {
        user: true,
      },
    });
    return studentInfo;
  }

  async getAllStudents(
    params: IPaginationOptions
  ): Promise<IPaginatedResult<IStudent>> {
    const page = params.page ? parseInt(params.page, 10) : 2;
    const cursorId = params.cursor ? parseInt(params.cursor, 10) : undefined;
    const skip = cursorId ? 1 : 0;

    const students = await prisma.student.findMany({
      take: page + 1,
      skip,
      ...(cursorId && { cursor: { student_id: cursorId } }),
      orderBy: { student_id: "asc" },
      include: { user: true },
    });
    const totalCount = await prisma.student.count();
    const hasMore = students.length > page;
    const nextCursor = hasMore
      ? students[students.length - 1].student_id
      : undefined;

    return {
      data: students,
      pagination: {
        nextCursor,
        prevCursor: cursorId || 0,
        pageSize: page,
        hasMore,
        currentCount: students.length,
        totalCount,
      },
    };
  }
  async getStudentById(stud_id: number): Promise<IStudent> {
    const student = await prisma.student.findFirst({
      where: { student_id: stud_id },
      include: {
        user: true,
      },
    });
    if (!student) {
      throw new EntityNotFound({
        message: `student with ID ${stud_id} not found`,
        statusCode: 404,
        code: "ENT_NT",
      });
    }
    return student;
  }

  async updateStudent(
    studentId: number,
    studentUpdateData: Partial<ICreateStudent>
  ): Promise<IStudent> {
    const checkStudentExist = await prisma.student.findUnique({
      where: { student_id: studentId },
    });
    if (!checkStudentExist) {
      throw new EntityNotFound({
        message: `student with !D ${studentId} not found`,
        statusCode: 404,
        code: "ENT_NT",
      });
    }
    const updatedStudent = await prisma.student.update({
      where: { student_id: studentId },
      data: {
        ...studentUpdateData,
      },
      include: {
        user: true,
      },
    });
    return updatedStudent;
  }
  async deleteStudent(studentId: number): Promise<void> {}
  async getStudentByDepartment(deptName: string): Promise<IStudent[]> {}
}

export default StudentService;
