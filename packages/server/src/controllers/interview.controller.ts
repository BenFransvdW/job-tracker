import { Request, Response, NextFunction } from 'express';
import { InterviewModel } from '../Interview.model';
import { ApplicationModel } from '../Application.model';

function getUserId(req: Request): string {
    return (req as any).user.userId;
}

async function checkAppOwnership(appId: string, userId: string, res: Response): Promise<boolean> {
    const app = await ApplicationModel.findOne({ _id: appId, userId });
    if (!app) {
        res.status(404).json({ error: 'NotFound', message: 'Application not found' });
        return false;
    }
    return true;
}

export async function list(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = getUserId(req);
        const appId = req.params.appId as string;
        if (!(await checkAppOwnership(appId, userId, res))) return;
        const interviews = await InterviewModel.find({ applicationId: appId, userId }).sort({ scheduledAt: 1 });
        res.json({ success: true, data: interviews });
    } catch (err) {
        next(err);
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = getUserId(req);
        const appId = req.params.appId as string;
        const app = await ApplicationModel.findOne({ _id: appId, userId });
        if (!app) return res.status(404).json({ error: 'NotFound', message: 'Application not found' });

        const interview = new InterviewModel({ ...req.body, applicationId: appId, userId });
        await interview.save();

        // Push interview ref to parent application and set status to interviewing
        app.interviews.push(interview._id as any);
        app.status = 'interviewing';
        await app.save();

        res.status(201).json({ success: true, data: interview });
    } catch (err) {
        next(err);
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = getUserId(req);
        const appId = req.params.appId as string;
        const interviewId = req.params.interviewId as string;
        if (!(await checkAppOwnership(appId, userId, res))) return;
        const interview = await InterviewModel.findOneAndUpdate(
            { _id: interviewId, applicationId: appId, userId },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!interview) return res.status(404).json({ error: 'NotFound', message: 'Interview not found' });
        res.json({ success: true, data: interview });
    } catch (err) {
        next(err);
    }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = getUserId(req);
        const appId = req.params.appId as string;
        const interviewId = req.params.interviewId as string;
        if (!(await checkAppOwnership(appId, userId, res))) return;
        const interview = await InterviewModel.findOneAndDelete({ _id: interviewId, applicationId: appId, userId });
        if (!interview) return res.status(404).json({ error: 'NotFound', message: 'Interview not found' });
        // Remove ref from parent application
        await ApplicationModel.findByIdAndUpdate(appId, { $pull: { interviews: interview._id } });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}
