import { NextFunction, Request, Response } from "express";
import config from "./config";
import jwt from "jsonwebtoken";

const JWT_SECRET = config.jwtSecret;

export const authenticate = (
    req : Request,
    res : Response,
    next : NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next({
                error : "AuthenticationError",
                message : "Missing token",
            });
        }
        const token = authHeader.split(" ")[1];

        const payload = jwt.verify(token, JWT_SECRET) as {
            userId : string;
        };

        (req as any).user = payload;
        next();
    } catch (err) {
        next({
            error : "AuthenticationError",
            message : "Invalid or expired token",
        });
    }
};