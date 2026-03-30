import mongoose from 'mongoose';
import config from '../src/config';
import app from '../src/app';

// Cache connection across serverless invocations
mongoose.set('bufferCommands', false);

let connected = false;

async function connectIfNeeded() {
    if (connected || mongoose.connection.readyState === 1) return;
    await mongoose.connect(config.mongoUrl);
    connected = true;
}

export default async function handler(req: any, res: any) {
    try {
        await connectIfNeeded();
        return app(req, res);
    } catch (err: any) {
        res.status(500).json({ error: 'InternalServerError', message: err?.message ?? 'Server failed to initialize' });
    }
}
