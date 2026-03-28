import { Request, Response, NextFunction} from "express";
import { ApiError } from "@job-tracker/shared"
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const errorHandler = (
    err: unknown, 
    req : Request,
    res : Response,
    next : NextFunction
) => {
    let status = 500;

    let apiError: ApiError = {
        error : "Internal Server Error",
        message : "Something went wrong"
    };

    // Mongoose Validation Errors
    if (err instanceof mongoose.Error.ValidationError) {
        status = 400;
        apiError = {
            error : "ValidationError",
            message : "Invalid Input Data",
            details : Object.values(err.errors).map(e => e.message),
        };
    }
    else if (err instanceof mongoose.Error.CastError) {
        status = 400;
        apiError = {
            error: "CastError",
            message : `Invalid value for field: ${err.path}`
        };
    }

    // JWT Token Errors
    else if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
        status = 401;

        apiError = {
            error : "AuthenticationError",
            message : "Invalid or expired token",
        };
    }
    // Generic JS Error
    else if (err instanceof Error) {
        apiError = {
            error : "Error",
            message : err.message,
        };
    }
    else {
        apiError = {
            error : "UnknownError",
            message : "An unknown error occured",
            details : err,
        };
    }

    res.status(status).json(apiError);
};