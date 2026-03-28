import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApplicationModel } from '../Application.model';
import { APPLICATION_STATUSES } from '@job-tracker/shared';

// Module-level 60s cache
const cache = new Map<string, { data: unknown; expiresAt: number }>();

function getCached<T>(key: string): T | null {
    const entry = cache.get(key);
    if (entry && entry.expiresAt > Date.now()) return entry.data as T;
    return null;
}

function setCached(key: string, data: unknown) {
    cache.set(key, { data, expiresAt: Date.now() + 60_000 });
}

export async function summary(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user.userId;
        const cacheKey = `summary:${userId}`;
        const cached = getCached(cacheKey);
        if (cached) return res.json({ success: true, data: cached });

        const countsByStatus = await ApplicationModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), deletedAt: { $exists: false } } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const counts = Object.fromEntries(APPLICATION_STATUSES.map(s => [s, 0]));
        for (const { _id, count } of countsByStatus) counts[_id] = count;

        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        const responded = (counts.offer ?? 0) + (counts.rejected ?? 0) + (counts.interviewing ?? 0);
        const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

        const data = { counts, total, responseRate };
        setCached(cacheKey, data);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}

export async function timeline(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user.userId;
        const weeks = parseInt((req.query.weeks as string) ?? '12');
        const cacheKey = `timeline:${userId}:${weeks}`;
        const cached = getCached(cacheKey);
        if (cached) return res.json({ success: true, data: cached });

        const since = new Date();
        since.setDate(since.getDate() - weeks * 7);

        const raw = await ApplicationModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: since }, deletedAt: { $exists: false } } },
            { $group: { _id: { $dateToString: { format: '%Y-%W', date: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        // Fill in zero-count weeks
        const weekMap = new Map(raw.map((r: any) => [r._id, r.count]));
        const data: Array<{ week: string; count: number }> = [];
        for (let i = weeks - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i * 7);
            // Use ISO week string matching the aggregation format
            const isoKey = d.toISOString().slice(0, 4) + '-' + String(Math.ceil((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))).padStart(2, '0');
            data.push({ week: isoKey, count: (weekMap.get(isoKey) ?? 0) as number });
        }

        setCached(cacheKey, data);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}

export async function funnel(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user.userId;
        const cacheKey = `funnel:${userId}`;
        const cached = getCached(cacheKey);
        if (cached) return res.json({ success: true, data: cached });

        const counts = await ApplicationModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), deletedAt: { $exists: false } } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const countMap = new Map(counts.map((c: any) => [c._id, c.count]));
        const funnelStages = ['wishlist', 'applied', 'interviewing', 'offer'];
        const total = Array.from(countMap.values()).reduce((a: number, b: number) => a + b, 0);

        const data = funnelStages.map(stage => ({
            stage,
            count: (countMap.get(stage) ?? 0) as number,
            percentage: total > 0 ? Math.round(((countMap.get(stage) ?? 0) as number / total) * 100) : 0
        }));

        setCached(cacheKey, data);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
}
