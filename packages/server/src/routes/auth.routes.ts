import { Router } from 'express';
import { validate } from '../validate';
import { authenticate } from '../authenticate';
import { register, login, refresh, logout, getMe, updateMe } from '../controllers/auth.controller';
import { registerSchema, loginSchema, updateMeSchema } from '@job-tracker/shared';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, getMe);
authRouter.patch('/me', authenticate, validate(updateMeSchema), updateMe);
