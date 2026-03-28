import dotenv from 'dotenv';
dotenv.config()

interface Config {
    mongoUrl : string,
    port : number,
    jwtSecret : string,
    jwtRefreshSecret : string,
    nodeEnv : string,
    corsOrigin : string
}

function requireEnv(key : string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required variable ${key}`);
    }
    return value
}

const config: Config = {
    mongoUrl : requireEnv('MONGO_URL'),
    port : parseInt(process.env.PORT ?? '3001', 10),
    jwtSecret : requireEnv('JWT_SECRET'),
    jwtRefreshSecret : requireEnv('JWT_REFRESH_SECRET'),
    nodeEnv : process.env.NODE_ENV ?? 'development',
    corsOrigin : process.env.CLIENT_URL ?? 'http://localhost:5173'
}

export default config;