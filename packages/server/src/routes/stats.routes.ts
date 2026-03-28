import { Router } from 'express';
import { authenticate } from '../authenticate';
import { summary, timeline, funnel } from '../controllers/stats.controller';

export const statsRouter = Router();

statsRouter.use(authenticate);

statsRouter.get('/summary', summary);
statsRouter.get('/timeline', timeline);
statsRouter.get('/funnel', funnel);
