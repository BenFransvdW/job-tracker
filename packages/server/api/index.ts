import mongoose from 'mongoose';
import config from '../src/config';
import app from '../src/app';

// Cache connection across serverless invocations
mongoose.set('bufferCommands', false);

let connectionPromise: Promise<typeof mongoose> | null = null;

mongoose.connection.on('disconnected', () => {
    connectionPromise = null;
});

async function connectIfNeeded() {
    if (mongoose.connection.readyState === 1) return;
    if (!connectionPromise) {
        connectionPromise = mongoose.connect(config.mongoUrl);
    }
    await connectionPromise;
}

export default async function handler(req: any, res: any) {
    try {
        await connectIfNeeded();
        return app(req, res);
    } catch (err: any) {
        res.status(500).json({ error: 'InternalServerError', message: err?.message ?? 'Server failed to initialize' });
    }
}
