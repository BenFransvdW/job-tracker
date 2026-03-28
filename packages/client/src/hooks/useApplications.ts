import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@job-tracker/shared';
import type { ApplicationFilters } from '../api/applications';
import { getApplications, getApplication, createApplication, updateApplication, updateApplicationStatus, deleteApplication } from '../api/applications';

export function useApplications(filters?: ApplicationFilters) {
    return useQuery({
        queryKey: [...QUERY_KEYS.applications, filters],
        queryFn: () => getApplications(filters),
    });
}

export function useApplication(id: string) {
    return useQuery({
        queryKey: QUERY_KEYS.application(id),
        queryFn: () => getApplication(id),
        enabled: !!id,
    });
}

export function useCreateApplication() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createApplication,
        onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.applications }),
    });
}

export function useUpdateApplication(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: unknown) => updateApplication(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QUERY_KEYS.applications });
            qc.invalidateQueries({ queryKey: QUERY_KEYS.application(id) });
        },
    });
}

export function useUpdateStatus(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (status: string) => updateApplicationStatus(id, status),
        onMutate: async (newStatus) => {
            await qc.cancelQueries({ queryKey: QUERY_KEYS.applications });
            const snapshot = qc.getQueryData(QUERY_KEYS.applications);
            qc.setQueryData([...QUERY_KEYS.applications], (old: any) => {
                if (!old?.data) return old;
                return { ...old, data: old.data.map((app: any) => app._id === id ? { ...app, status: newStatus } : app) };
            });
            return { snapshot };
        },
        onError: (_err, _vars, ctx: any) => {
            if (ctx?.snapshot) qc.setQueryData(QUERY_KEYS.applications, ctx.snapshot);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.applications }),
    });
}

export function useDeleteApplication() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteApplication,
        onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.applications }),
    });
}
