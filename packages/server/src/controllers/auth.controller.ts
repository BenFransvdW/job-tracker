import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel } from '../User.model';
import config from '../config';

// Access token: 15 minutes, Refresh token: 7 days
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_COOKIE_NAME = 'refreshToken';

function issueTokens(userId: string): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign({ userId }, config.jwtSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ userId }, config.jwtRefreshSecret, { expiresIn: REFRESH_TOKEN_EXPIRY });
    return { accessToken, refreshToken };
}

function setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password, name } = req.body;
        const existing = await UserModel.findByEmail(email);
        if (existing) {
            return res.status(409).json({ error: 'ConflictError', message: 'Email already registered' });
        }
        const user = new UserModel({ email, passwordHash: password, name });
        const { accessToken, refreshToken } = issueTokens(user._id.toString());
        const hashedRefresh = await bcrypt.hash(refreshToken, 10);
        user.refreshTokens = [hashedRefresh];
        await user.save();
        setRefreshCookie(res, refreshToken);
        res.status(201).json({
            accessToken,
            user: { _id: user._id, email: user.email, name: user.name, preferences: user.preferences, createdAt: user.createdAt, updatedAt: user.updatedAt }
        });
    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findByEmail(email);
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'AuthenticationError', message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = issueTokens(user._id.toString());
        const hashedRefresh = await bcrypt.hash(refreshToken, 10);
        user.refreshTokens = [...user.refreshTokens, hashedRefresh];
        await user.save();
        setRefreshCookie(res, refreshToken);
        res.json({
            accessToken,
            user: { _id: user._id, email: user.email, name: user.name, preferences: user.preferences, createdAt: user.createdAt, updatedAt: user.updatedAt }
        });
    } catch (err) {
        next(err);
    }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ error: 'AuthenticationError', message: 'No refresh token' });
        }
        const payload = jwt.verify(token, config.jwtRefreshSecret) as { userId: string };
        const user = await UserModel.findById(payload.userId);
        if (!user) {
            return res.status(401).json({ error: 'AuthenticationError', message: 'User not found' });
        }
        // Find matching hashed token
        let matchIndex = -1;
        for (let i = 0; i < user.refreshTokens.length; i++) {
            if (await bcrypt.compare(token, user.refreshTokens[i])) {
                matchIndex = i;
                break;
            }
        }
        if (matchIndex === -1) {
            // Token reuse detected — revoke all tokens
            user.refreshTokens = [];
            await user.save();
            return res.status(401).json({ error: 'AuthenticationError', message: 'Refresh token reuse detected' });
        }
        const { accessToken, refreshToken: newRefresh } = issueTokens(user._id.toString());
        const hashedNew = await bcrypt.hash(newRefresh, 10);
        user.refreshTokens = [
            ...user.refreshTokens.filter((_, i) => i !== matchIndex),
            hashedNew
        ];
        await user.save();
        setRefreshCookie(res, newRefresh);
        res.json({ accessToken });
    } catch (err) {
        next(err);
    }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.refreshToken;
        if (token) {
            try {
                const payload = jwt.verify(token, config.jwtRefreshSecret) as { userId?: string };
                if (payload?.userId) {
                    const user = await UserModel.findById(payload.userId);
                    if (user) {
                        const results = await Promise.all(
                            user.refreshTokens.map(t => bcrypt.compare(token, t))
                        );
                        user.refreshTokens = user.refreshTokens.filter((_, i) => !results[i]);
                        await user.save();
                    }
                }
            } catch {
                // Invalid token — still clear the cookie below
            }
        }
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out' });
    } catch (err) {
        next(err);
    }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user.userId;
        const user = await UserModel.findById(userId).select('-passwordHash -refreshTokens');
        if (!user) return res.status(404).json({ error: 'NotFound', message: 'User not found' });
        res.json({ user });
    } catch (err) {
        next(err);
    }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user.userId;
        const { name, currentPassword, newPassword, preferences } = req.body;
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ error: 'NotFound', message: 'User not found' });

        if (newPassword && currentPassword) {
            const valid = await user.comparePassword(currentPassword);
            if (!valid) {
                return res.status(400).json({ error: 'ValidationError', message: 'Current password is incorrect' });
            }
            user.passwordHash = newPassword; // pre-save hook will hash it
        }
        if (name !== undefined) user.name = name;
        if (preferences) {
            user.preferences = { ...user.preferences, ...preferences };
        }
        await user.save();
        res.json({ user: { _id: user._id, email: user.email, name: user.name, preferences: user.preferences, createdAt: user.createdAt, updatedAt: user.updatedAt } });
    } catch (err) {
        next(err);
    }
}
