import { Request, Response, NextFunction} from 'express'
import { ZodError, ZodSchema } from 'zod';

export const validate = (schema : ZodSchema) => (req : Request, res : Response, next : NextFunction) => {
    try {
        const result = schema.parse(req.body);
        req.body = result;
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            next({
                name : "ZodValidationError",
                message : "Request validation failed",
                details: err.errors.map(e => ({
                    field : e.path.join("."),
                    message : e.message,
                })),
            });
        } else {
            next(err);
        }
    }
};