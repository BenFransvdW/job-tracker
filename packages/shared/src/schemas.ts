import { z } from 'zod';
import { APPLICATION_STATUSES, INTERVIEW_TYPES } from './constants';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1).max(80)
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
})

export const salaryRangeSchema = z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.string().length(3),
    period: z.enum(['annual', 'monthly', 'hourly'])
})

export const createApplicationSchema = z.object({
    company: z.string().min(1).max(120),
    role: z.string().min(1).max(120),
    status: z.enum(APPLICATION_STATUSES),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    jobUrl: z.string().url().optional(),
    salary: salaryRangeSchema.optional(),
    location: z.string().max(80).optional(),
    notes: z.string().optional(),
    tags: z.array(z.string().max(30)).max(20).default([]),
    nextFollowUpAt: z.string().datetime().optional()
})

export const updateApplicationSchema = createApplicationSchema.partial();

export const updateStatusSchema = z.object({
    status: z.enum(APPLICATION_STATUSES)
})

export const reorderSchema = z.object({
    ids: z.array(z.string()).min(1),
    status: z.enum(APPLICATION_STATUSES)
})

export const createInterviewSchema = z.object({
    type: z.enum(INTERVIEW_TYPES),
    round: z.number().int().min(1),
    scheduledAt: z.string().datetime(),
    durationMins: z.number().int().min(1).optional(),
    interviewers: z.array(z.string()).default([]),
    notes: z.string().optional()
})

export const updateInterviewSchema = createInterviewSchema.partial();

export const contactSchema = z.object({
    name: z.string().min(1),
    role: z.string().optional(),
    email: z.string().email().optional(),
    linkedin: z.string().url().optional(),
    notes: z.string().optional()
})

export const updateMeSchema = z.object({
    name: z.string().min(1).max(80).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).optional(),
    preferences: z.object({
        timezone: z.string().optional(),
        defaultBoardView: z.enum(['board', 'list']).optional(),
        emailReminders: z.boolean().optional(),
        reminderDaysBefore: z.number().int().min(1).optional(),
    }).optional()
})
export type UpdateMeInput = z.infer<typeof updateMeSchema>