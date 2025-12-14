export default class AppError extends Error {
    message;
    statusCode;
    code;
    constructor({ message, statusCode, code, }) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
    }
}
export class EntityNotFound extends AppError {
}
export class EntityExistError extends AppError {
}
export class InputDataError extends AppError {
}
export class AuthenticationError extends AppError {
}
export class AuthorizationError extends AppError {
}
