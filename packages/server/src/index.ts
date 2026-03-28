import mongoose from 'mongoose';
import config from './config';
import app from './app';

mongoose.set('bufferCommands', false);

async function start() {
    await mongoose.connect(config.mongoUrl);
    console.log('Connected to MongoDB');
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
}

start().catch(console.error);
