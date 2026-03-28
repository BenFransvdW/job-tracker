import type { Interview } from '@job-tracker/shared';
import { apiGet, apiPost, apiPut, apiDelete } from './client';

export interface InterviewsResponse {
    success: boolean;
    data: Interview[];
}

export interface InterviewResponse {
    success: boolean;
    data: Interview;
}

export function getInterviews(appId: string): Promise<InterviewsResponse> {
    return apiGet(`/api/applications/${appId}/interviews`);
}

export function createInterview(appId: string, data: unknown): Promise<InterviewResponse> {
    return apiPost(`/api/applications/${appId}/interviews`, data);
}

export function updateInterview(appId: string, interviewId: string, data: unknown): Promise<InterviewResponse> {
    return apiPut(`/api/applications/${appId}/interviews/${interviewId}`, data);
}

export function deleteInterview(appId: string, interviewId: string): Promise<{ success: boolean }> {
    return apiDelete(`/api/applications/${appId}/interviews/${interviewId}`);
}
