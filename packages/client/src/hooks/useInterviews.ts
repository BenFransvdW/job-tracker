import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@job-tracker/shared';
import { getInterviews, createInterview, updateInterview, deleteInterview } from '../api/interviews';

export function useInterviews(appId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.interviews(appId),
        queryFn: () => getInterviews(appId),
        enabled: !!appId,
    });
}

export function useCreateInterview(appId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: unknown) => createInterview(appId, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.interviews(appId) });
            qc.invalidateQueries({ queryKey: QUERY_KEYS.applications });
        },
    });
}

export function useUpdateInterview(appId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ interviewId, data }: { interviewId: string; data: unknown }) =>
            updateInterview(appId, interviewId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.interviews(appId) }),
    });
}

export function useDeleteInterview(appId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (interviewId: string) => deleteInterview(appId, interviewId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.interviews(appId) });
            qc.invalidateQueries({ queryKey: QUERY_KEYS.applications });
        },
    });
}
