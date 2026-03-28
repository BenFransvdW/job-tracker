import { APPLICATION_STATUSES, INTERVIEW_TYPES, PRIORITY_LEVEL } from "./constants";

// Union Types
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];
export type InterviewType = typeof INTERVIEW_TYPES[number];
export type Priority = typeof PRIORITY_LEVEL[number];

// Interface Types
export interface SalaryRange {
    min : number,
    max : number,
    currency : string,
    period : 'annual' | 'monthly' | 'hourly'
}

export interface Contact {
    name : string,
    role? : string,
    email? : string,
    linkedin? : string,
    notes? : string
}

export interface UserPreferences {
    timezone : string,
    defaultBoardView : 'board' | 'list',
    emailReminders : boolean,
    reminderDaysBefore : number
}

export interface User {
    _id : string,
    email : string,
    name : string,
    preferences : UserPreferences,
    createdAt : string,
    updatedAt : string
}

export interface Interview {
    _id : string,
    applicationId : string,
    userId : string,
    type : InterviewType,
    round : number,
    scheduledAt : string,
    durationMins? : number,
    interviewers : string[],
    notes? : string,
    outcome : 'pending' | 'passed' | 'failed',
    createdAt : string,
    updatedAt : string
}

export interface Application {
    _id : string,
    userId : string,
    company : string,
    role : string,
    status : ApplicationStatus,
    priority : Priority,
    jobUrl? : string,
    salary? : SalaryRange,
    location? : string,
    notes? : string,
    tags : string[],
    appliedAt? : string,
    nextFollowUpAt? : string,
    boardPosition : number,
    contacts : Contact[],
    interviews : string[],
    createdAt : string,
    updatedAt : string
}

export interface TokenPair {
    accessToken : string,
    refreshToken : string
}

export interface ApiError {
    error : string,
    message : string,
    details? : unknown
}