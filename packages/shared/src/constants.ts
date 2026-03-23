export const APPLICATION_STATUSES = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected', 'ghosted'] as const;
export const INTERVIEW_TYPES = ['phone', 'video', 'onsite', 'take-home', 'panel'] as const;
export const PRIORITY_LEVEL = ['low', 'medium', 'high'] as const;

export type Application_Status = typeof APPLICATION_STATUSES[number];

export const STATUS_LABELS: Record<Application_Status, string> = {
    wishlist : 'Wishlist',
    applied : 'Applied',
    interviewing : 'Interviewing',
    offer : 'Offer Received',
    rejected : 'Rejected',
    ghosted: 'Ghosted'
}

export type Status_Colors = typeof APPLICATION_STATUSES[number];

export const STATUS_COLORS: Record<Status_Colors, string> = {
    wishlist : 'blue',
    applied : 'green',
    interviewing : 'amber',
    offer : 'teal',
    rejected : 'red',
    ghosted : 'gray'
}