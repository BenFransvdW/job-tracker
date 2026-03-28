import { Request, Response, NextFunction } from 'express';
import { ApplicationModel } from '../Application.model';

function getUserId(req: Request): string {
    return (req as any).user.userId;
}

export async function list(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = getUserId(req);
        const { status, tags, search, sort = 'boardPosition', page = '1' } = req.query as Record<string, string>;
        const limit = 50;
        const skip = (parseInt(page) - 1) * limit;

        const filter: Record<string, unknown> = { userId };
        if (status) filter.status = status;
        if (tags) filter.tags = { $in: tags.split(',') };
        if (search) filter.$text = { $search: search };

        const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
        const sortDir = sort.startsWith('-') ? -1 : 1;

        const [applications, total] = await Promise.all([
            ApplicationModel.find(filter)
                .sort({ [sortField]: sortDir })
                .skip(skip)
                .limit(limit)
                .populate('interviews'),
            ApplicationModel.countDocuments(filter)
        ]);

        res.json({ success: true, data: applications, meta: { total, page: parseInt(page), limit } });
    } catch (err) {
        next(err);
    }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = getUserId(req);
        const application = await ApplicationModel.findOne({ _id: req.params.id, userId }).populate('interviews');
        if (!application) return res.status(404).json({ error: 'NotFound', message: 'Application not found' });
        res.json({ success: true, data: application });
    } catch (err) {
        next(err);
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = getUserId(req);
        const count = await ApplicationModel.countDocuments({ userId, status: req.body.status ?? 'wishlist' });
        const application = new ApplicationModel({ ...req.body, userId, boardPosition: count });
        await application.save();
        res.status(201).json({ success: true, data: application });
    } catch (err) {
        next(err);
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = getUserId(req);
        const application = await ApplicationModel.findOneAndUpdate(
            { _id: req.params.id, userId },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!application) return res.status(404).json({ error: 'NotFound', message: 'Application not found' });
        res.json({ success: true, data: application });
    } catch (err) {
        next(err);
    }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = getUserId(req);
        const { status } = req.body;
        const update: Record<string, unknown> = { status };
        if (status === 'applied') update.appliedAt = new Date();
        const application = await ApplicationModel.findOneAndUpdate(
            { _id: req.params.id, userId },
            { $set: update },
            { new: true }
        );
        if (!application) return res.status(404).json({ error: 'NotFound', message: 'Application not found' });
        res.json({ success: true, data: application });
    } catch (err) {
        next(err);
    }
}

export async function reorder(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = getUserId(req);
        const { ids, status } = req.body as { ids: string[]; status: string };
        const ops = ids.map((id, index) => ({
            updateOne: {
                filter: { _id: id, userId },
                update: { $set: { boardPosition: index, status } }
            }
        }));
        await ApplicationModel.bulkWrite(ops as any);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = getUserId(req);
        const application = await ApplicationModel.findOneAndUpdate(
            { _id: req.params.id, userId },
            { $set: { deletedAt: new Date() } },
            { new: true }
        );
        if (!application) return res.status(404).json({ error: 'NotFound', message: 'Application not found' });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}
