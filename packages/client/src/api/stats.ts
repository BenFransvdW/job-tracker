import { apiGet } from './client';

export interface SummaryStats {
    counts: Record<string, number>;
    total: number;
    responseRate: number;
}

export interface TimelinePoint {
    week: string;
    count: number;
}

export interface FunnelStage {
    stage: string;
    count: number;
    percentage: number;
}

export function getSummaryStats(): Promise<{ success: boolean; data: SummaryStats }> {
    return apiGet('/api/stats/summary');
}

export function getTimelineStats(weeks = 12): Promise<{ success: boolean; data: TimelinePoint[] }> {
    return apiGet(`/api/stats/timeline?weeks=${weeks}`);
}

export function getFunnelStats(): Promise<{ success: boolean; data: FunnelStage[] }> {
    return apiGet('/api/stats/funnel');
}
