"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationError = exports.AuthenticationError = exports.InputDataError = exports.EntityExistError = exports.EntityNotFound = void 0;
class AppError extends Error {
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
exports.default = AppError;
class EntityNotFound extends AppError {
}
exports.EntityNotFound = EntityNotFound;
class EntityExistError extends AppError {
}
exports.EntityExistError = EntityExistError;
class InputDataError extends AppError {
}
exports.InputDataError = InputDataError;
class AuthenticationError extends AppError {
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends AppError {
}
exports.AuthorizationError = AuthorizationError;
