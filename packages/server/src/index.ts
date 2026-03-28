import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import config from './config';
import { errorHandler } from './errorHandler';

import { authRouter } from './routes/auth.routes';
// import { applicationRouter } from './routes/application.routes';
// import { interviewRouter } from './routes/interview.routes';
// import { statsRouter } from './routes/stats.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
// app.use('/api/applications', applicationRouter);
// app.use('/api/stats', statsRouter);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});

// Error handler must be last
app.use(errorHandler);

async function start() {
    await mongoose.connect(config.mongoUrl);
    console.log('Connected to MongoDB');
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
}

start().catch(console.error);

export { app };
