import type { ApplicationStatus, Priority } from '@job-tracker/shared';
import { STATUS_COLORS, STATUS_LABELS } from '@job-tracker/shared';

const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    amber: 'bg-amber-100 text-amber-800',
    teal: 'bg-teal-100 text-teal-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
};

interface BadgeProps {
    label: string;
    color?: string;
    className?: string;
}

export function Badge({ label, color = 'gray', className = '' }: BadgeProps) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[color] ?? colorMap.gray} ${className}`}>
            {label}
        </span>
    );
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
    return <Badge label={STATUS_LABELS[status]} color={STATUS_COLORS[status]} />;
}

export function PriorityDot({ priority }: { priority: Priority }) {
    const dotColors: Record<string, string> = { low: 'bg-gray-400', medium: 'bg-amber-400', high: 'bg-red-500' };
    return <span className={`inline-block w-2 h-2 rounded-full ${dotColors[priority]}`} title={priority} />;
}
