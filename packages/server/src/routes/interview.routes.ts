import { Router } from 'express';
import { authenticate } from '../authenticate';
import { validate } from '../validate';
import { list, create, update, remove } from '../controllers/interview.controller';
import { createInterviewSchema, updateInterviewSchema } from '@job-tracker/shared';

export const interviewRouter = Router({ mergeParams: true });

interviewRouter.use(authenticate);

interviewRouter.get('/', list);
interviewRouter.post('/', validate(createInterviewSchema), create);
interviewRouter.put('/:interviewId', validate(updateInterviewSchema), update);
interviewRouter.delete('/:interviewId', remove);
