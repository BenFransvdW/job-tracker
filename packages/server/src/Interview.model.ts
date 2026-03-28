import mongoose, { Schema, Document, Model } from "mongoose";
import { Interview } from "@job-tracker/shared";
import { INTERVIEW_TYPES } from "@job-tracker/shared";

type InterviewDocument = Interview & Document;
type InterviewModel = Model<InterviewDocument>;

const interviewSchema = new Schema({
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: INTERVIEW_TYPES, required: true },
    round: { type: Number, required: true, min: 1 },
    scheduledAt: { type: Date, required: true },
    durationMins: Number,
    interviewers: [{ type: String }],
    notes: String,
    outcome: { type: String, enum: ['pending', 'passed', 'failed'], default: 'pending' },
}, { timestamps: true });

export const InterviewModel = mongoose.model<InterviewDocument, InterviewModel>(
    'Interview',
    interviewSchema
);
