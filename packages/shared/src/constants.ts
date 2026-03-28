import type { ApplicationStatus } from "./types";

export const APPLICATION_STATUSES = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected', 'ghosted'] as const;
export const INTERVIEW_TYPES = ['phone', 'video', 'onsite', 'take-home', 'panel'] as const;
export const PRIORITY_LEVEL = ['low', 'medium', 'high'] as const;

export const STATUS_LABELS: Record<typeof APPLICATION_STATUSES[number], string> = {
    wishlist : 'Wishlist',
    applied : 'Applied',
    interviewing : 'Interviewing',
    offer : 'Offer Received',
    rejected : 'Rejected',
    ghosted: 'Ghosted'
} as const;


export const STATUS_COLORS: Record<ApplicationStatus, string> = {
    wishlist : 'blue',
    applied : 'green',
    interviewing : 'amber',
    offer : 'teal',
    rejected : 'red',
    ghosted : 'gray'
} as const;

export const PRIORITY_COLORS: Record<typeof PRIORITY_LEVEL[number], string> = {
    low : 'gray',
    medium : 'amber',
    high : 'red'
} as const;

export const QUERY_KEYS = {
    applications : ['applications'],
    application: (id: string) => ['application', id],
    interviews: (appId : string) => ['interviews', appId],
    stats: {
        summary : ['stats', 'summary'],
        timeline: (weeks: number) => ['stats', 'timeline', weeks],
        funnel: ['stats', 'funnel']
    }
} as const;

export const API_ROUTES = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        refresh: '/auth/refresh',
        logout: '/auth/logout',
        me: '/auth/me'
    },
    applications: {
        list: '/applications',
        detail: (id: string) => `/applications/${id}`,
        status: (id: string) => `/applications/${id}/status`,
        reorder: (id: string) => `/applications/${id}/reorder`,
    },
    interviews: {
        list: (appId: string) => `/applications/${appId}/interviews`,
        detail: (appId: string, id: string) => `/applications/${appId}/interviews/${id}`,
    },
    stats: {
        summary: '/stats/summary',
        timeline: '/stats/timeline',
        funnel: '/stats/funnel',
    }
} as const