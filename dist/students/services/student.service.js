"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = require("../../error/CustomError");
const passwordUtils_1 = __importDefault(require("../../utils/passwordUtils"));
const database_1 = require("../../config/database");
class StudentService {
    async createStudent(student) {
        const checkExistingUser = await database_1.prisma.user.findUnique({
            where: { email: student.email },
        });
        if (checkExistingUser) {
            throw new CustomError_1.EntityExistError({
                message: `user with ${student.email} already exist`,
                statusCode: 409,
                code: "ENT_EXT",
            });
        }
        const hashPassword = await passwordUtils_1.default.hashPassword(student.password);
        const studentInfo = await database_1.prisma.student.create({
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
    async getAllStudents(params) {
        const page = params.page ? parseInt(params.page, 10) : 2;
        const cursorId = params.cursor ? parseInt(params.cursor, 10) : undefined;
        const skip = cursorId ? 1 : 0;
        const students = await database_1.prisma.student.findMany({
            take: page + 1,
            skip,
            ...(cursorId && { cursor: { student_id: cursorId } }),
            orderBy: { student_id: "asc" },
            include: { user: { omit: { password: true } } },
        });
        if (students.length === 0) {
            throw new CustomError_1.EntityNotFound({
                message: "no students found",
                statusCode: 404,
                code: "ENT_NT",
            });
        }
        const totalCount = await database_1.prisma.student.count();
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
    async getStudentById(stud_id) {
        const student = await database_1.prisma.student.findFirst({
            where: { student_id: stud_id },
            include: {
                user: true,
            },
        });
        if (!student) {
            throw new CustomError_1.EntityNotFound({
                message: `student with ID ${stud_id} not found`,
                statusCode: 404,
                code: "ENT_NT",
            });
        }
        return student;
    }
    async updateStudent(studentId, studentUpdateData) {
        await this.checkStudentExist(studentId);
        const { userData, studentData } = this.separateStudentandUserFields(studentUpdateData);
        const updatedStudent = await database_1.prisma.student.update({
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
    async deleteStudent(studentId) {
        await this.checkStudentExist(studentId);
        await database_1.prisma.student.delete({
            where: {
                student_id: studentId,
            },
        });
    }
    async getStudentByDepartment(deptName) {
        const studentDept = await database_1.prisma.student.findMany({
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
            throw new CustomError_1.EntityNotFound({
                message: `no such ${deptName} exist`,
                statusCode: 400,
            });
        }
        return studentDept;
    }
    separateStudentandUserFields(data) {
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
        const userData = {};
        const studentData = {};
        Object.entries(data).forEach(([key, value]) => {
            if (userFields.includes(key)) {
                userData[key] = value;
            }
            else if (key !== "userId") {
                studentData[key] = value;
            }
        });
        return { userData, studentData };
    }
    async checkStudentExist(studentId) {
        const studentExist = await database_1.prisma.student.findUnique({
            where: {
                student_id: studentId,
            },
        });
        if (!studentExist) {
            throw new CustomError_1.EntityNotFound({
                message: `student with ${studentId} ID does not exist`,
                statusCode: 404,
                code: "ENT_NT",
            });
        }
    }
}
exports.default = StudentService;
