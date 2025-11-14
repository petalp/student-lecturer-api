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

    if (students.length === 0) {
      throw new EntityNotFound({
        message: "no students found",
        statusCode: 404,
        code: "ENT_NT",
      });
    }
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
    await this.checkStudentExist(studentId);
    const { userData, studentData } =
      this.separateStudentandUserFields(studentUpdateData);
    const updatedStudent = await prisma.student.update({
      where: { student_id: studentId },
      data: {
        ...studentData,
        user: {
          update: {
            ...userData,
          },
        },
      },

      include: {
        user: true,
      },
    });
    return updatedStudent;
  }
  async deleteStudent(studentId: number): Promise<void> {
    await this.checkStudentExist(studentId);
    await prisma.student.delete({
      where: {
        student_id: studentId,
      },
    });
  }
  async getStudentByDepartment(deptName: string): Promise<IStudent[]> {
    const studentDept = await prisma.student.findMany({
      where: {
        deptName,
      },
      orderBy: {
        student_id: "asc",
      },
      include: {
        user: true,
      },
    });
    if (studentDept.length === 0) {
      throw new EntityNotFound({
        message: `no such ${deptName} exist`,
        statusCode: 400,
      });
    }
    return studentDept;
  }

  private separateStudentandUserFields(data: Partial<ICreateStudent>) {
    const userFields = [
      "firstName",
      "middleName",
      "lastName",
      "username",
      "email",
      "password",
      "sex",
      "role",
    ];

    const userData: any = {};
    const studentData: any = {};

    Object.entries(data).forEach(([key, value]) => {
      if (userFields.includes(key)) {
        userData[key] = value;
      } else if (key !== "userId") {
        studentData[key] = value;
      }
    });
    return { userData, studentData };
  }

  private async checkStudentExist(studentId: number): Promise<void> {
    const studentExist = await prisma.student.findUnique({
      where: {
        student_id: studentId,
      },
    });

    if (!studentExist) {
      throw new EntityNotFound({
        message: `student with ${studentId} ID does not exist`,
        statusCode: 404,
        code: "ENT_NT",
      });
    }
  }
}

export default StudentService;
