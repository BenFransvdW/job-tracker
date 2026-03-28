import { Router } from 'express';
import { authenticate } from '../authenticate';
import { validate } from '../validate';
import { list, getOne, create, update, updateStatus, reorder, remove } from '../controllers/application.controller';
import { createApplicationSchema, updateApplicationSchema, updateStatusSchema, reorderSchema } from '@job-tracker/shared';

export const applicationRouter = Router();

applicationRouter.use(authenticate);

applicationRouter.get('/', list);
applicationRouter.post('/', validate(createApplicationSchema), create);
applicationRouter.get('/:id', getOne);
applicationRouter.put('/:id', validate(updateApplicationSchema), update);
applicationRouter.patch('/:id/status', validate(updateStatusSchema), updateStatus);
applicationRouter.patch('/:id/reorder', validate(reorderSchema), reorder);
applicationRouter.delete('/:id', remove);
