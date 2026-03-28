import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { Application } from "@job-tracker/shared";
import { APPLICATION_STATUSES, PRIORITY_LEVEL } from "@job-tracker/shared";

type ApplicationDocument = Omit<Application, 'interviews'> & {
    interviews: Types.ObjectId[];
} & Document;
type ApplicationModel = Model<ApplicationDocument>;

const salaryRangeSchema = new Schema({
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
    currency: { type: String, minlength: 3, maxlength: 3 },
    period: { type: String, enum: ['annual', 'monthly', 'hourly'] }
}, { _id: false });

const contactSchema = new Schema({
    name: { type: String, required: true },
    role: String,
    email: String,
    linkedin: String,
    notes: String
}, { _id: false });

const applicationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, enum: APPLICATION_STATUSES, required: true, default: 'wishlist' },
    priority: { type: String, enum: PRIORITY_LEVEL, required: true, default: 'medium' },
    jobUrl: String,
    salary: salaryRangeSchema,
    location: String,
    notes: String,
    tags: [{ type: String }],
    appliedAt: Date,
    nextFollowUpAt: Date,
    boardPosition: { type: Number, default: 0 },
    contacts: [contactSchema],
    interviews: [{ type: Schema.Types.ObjectId, ref: 'Interview' }],
    deletedAt: Date,
}, { timestamps: true });

// Compound index for fast board queries
applicationSchema.index({ userId: 1, status: 1 });
// Text index for search
applicationSchema.index({ company: 'text', role: 'text' });

// Pre-find hook: filter out soft-deleted documents
applicationSchema.pre(['find', 'findOne'], function() {
    this.where({ deletedAt: { $exists: false } });
});

export const ApplicationModel = mongoose.model<ApplicationDocument, ApplicationModel>(
    'Application',
    applicationSchema
);
