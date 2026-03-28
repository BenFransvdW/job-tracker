import type { Application } from '@job-tracker/shared';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './client';

export interface ApplicationsResponse {
    success: boolean;
    data: Application[];
    meta: { total: number; page: number; limit: number };
}

export interface ApplicationResponse {
    success: boolean;
    data: Application;
}

export interface ApplicationFilters {
    status?: string;
    tags?: string;
    search?: string;
    sort?: string;
    page?: number;
}

export function getApplications(filters?: ApplicationFilters): Promise<ApplicationsResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.tags) params.set('tags', filters.tags);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.sort) params.set('sort', filters.sort);
    if (filters?.page) params.set('page', String(filters.page));
    const qs = params.toString();
    return apiGet(`/api/applications${qs ? `?${qs}` : ''}`);
}

export function getApplication(id: string): Promise<ApplicationResponse> {
    return apiGet(`/api/applications/${id}`);
}

export function createApplication(data: unknown): Promise<ApplicationResponse> {
    return apiPost('/api/applications', data);
}

export function updateApplication(id: string, data: unknown): Promise<ApplicationResponse> {
    return apiPut(`/api/applications/${id}`, data);
}

export function updateApplicationStatus(id: string, status: string): Promise<ApplicationResponse> {
    return apiPatch(`/api/applications/${id}/status`, { status });
}

export function reorderApplications(id: string, ids: string[], status: string): Promise<{ success: boolean }> {
    return apiPatch(`/api/applications/${id}/reorder`, { ids, status });
}

export function deleteApplication(id: string): Promise<{ success: boolean }> {
    return apiDelete(`/api/applications/${id}`);
}
