import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../validate';
import { authenticate } from '../authenticate';
import { register, login, refresh, logout, getMe, updateMe } from '../controllers/auth.controller';
import { registerSchema, loginSchema, updateMeSchema } from '@job-tracker/shared';

// 10 attempts per 15 minutes for login and register
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'TooManyRequests', message: 'Too many attempts, please try again later.' },
});

// 60 per 15 minutes for refresh (called automatically by the client)
const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'TooManyRequests', message: 'Too many requests, please try again later.' },
});

export const authRouter = Router();

authRouter.post('/register', authLimiter, validate(registerSchema), register);
authRouter.post('/login', authLimiter, validate(loginSchema), login);
authRouter.post('/refresh', refreshLimiter, refresh);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, getMe);
authRouter.patch('/me', authenticate, validate(updateMeSchema), updateMe);
