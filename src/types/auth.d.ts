interface ICreateUser {
  first_name: string;
  middle_name?: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  sex: string;
  role: Role;
}

export interface IStudent {
  level: number;
  studentId: number;
  facultyName: string;
  deptName: string;
  userId: number;
}

export interface ILecturer {
  lecturer_id: number;
  facultyName: string;
  deptName: string;
  userId: number;
}

export interface IResponseStudent {
  level: number;
  studentId: number;
  facultyName: string;
  deptName: string;
  student_id: number;
  userId: number;
}

export interface IResponseUserStudent {
  user_id: number;
  username: string;
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  password: string;
  role: Role;
  sex: string;
  createAt: Date;
  updateAt: Date;
  student: IResponseStudent | null;
}
