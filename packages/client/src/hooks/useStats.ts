import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@job-tracker/shared';
import { getSummaryStats, getTimelineStats, getFunnelStats } from '../api/stats';

const FIVE_MINUTES = 5 * 60 * 1000;

export function useSummaryStats() {
    return useQuery({
        queryKey: QUERY_KEYS.stats.summary,
        queryFn: getSummaryStats,
        staleTime: FIVE_MINUTES,
    });
}

export function useTimelineStats(weeks = 12) {
    return useQuery({
        queryKey: QUERY_KEYS.stats.timeline(weeks),
        queryFn: () => getTimelineStats(weeks),
        staleTime: FIVE_MINUTES,
    });
}

export function useFunnelStats() {
    return useQuery({
        queryKey: QUERY_KEYS.stats.funnel,
        queryFn: getFunnelStats,
        staleTime: FIVE_MINUTES,
    });
}
