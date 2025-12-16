import AppError from "../error/CustomError.js";
export function errorHandlingMiddleware(error, req, res, next) {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            message: error.message,
            code: error.code,
        });
        return;
    }
    return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
    });
}
