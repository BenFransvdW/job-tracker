import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Application } from '@job-tracker/shared';
import { PriorityDot, StatusBadge } from '../ui/Badge';

interface ApplicationCardProps {
    application: Application;
    overlay?: boolean;
}

function daysSince(dateStr?: string): number | null {
    if (!dateStr) return null;
    return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

export function ApplicationCard({ application, overlay = false }: ApplicationCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: application._id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const days = daysSince(application.appliedAt);

    return (
        <div
            ref={setNodeRef}
            style={overlay ? {} : style}
            {...attributes}
            {...listeners}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-grab active:cursor-grabbing select-none ${overlay ? 'shadow-lg rotate-2' : ''}`}
        >
            <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-medium text-sm text-gray-900 leading-tight">{application.company}</p>
                <PriorityDot priority={application.priority} />
            </div>
            <p className="text-sm text-gray-600 mb-2">{application.role}</p>
            <div className="flex items-center justify-between">
                <StatusBadge status={application.status} />
                {days !== null && <span className="text-xs text-gray-400">{days}d ago</span>}
            </div>
        </div>
    );
}
