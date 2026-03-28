import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Application, ApplicationStatus } from '@job-tracker/shared';
import { STATUS_LABELS, STATUS_COLORS } from '@job-tracker/shared';
import { ApplicationCard } from './ApplicationCard';

interface KanbanColumnProps {
    status: ApplicationStatus;
    applications: Application[];
}

const headerColors: Record<string, string> = {
    blue: 'border-blue-400', green: 'border-green-400', amber: 'border-amber-400',
    teal: 'border-teal-400', red: 'border-red-400', gray: 'border-gray-400'
};

export function KanbanColumn({ status, applications }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: status });
    const color = STATUS_COLORS[status];

    return (
        <div className="flex flex-col w-72 flex-shrink-0">
            <div className={`bg-white rounded-t-lg border-t-4 ${headerColors[color]} px-4 py-3 flex items-center justify-between`}>
                <h3 className="font-semibold text-gray-900 text-sm">{STATUS_LABELS[status]}</h3>
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">{applications.length}</span>
            </div>
            <div
                ref={setNodeRef}
                className={`flex-1 min-h-[200px] rounded-b-lg p-2 space-y-2 transition-colors ${isOver ? 'bg-blue-50' : 'bg-gray-50'}`}
            >
                <SortableContext items={applications.map(a => a._id)} strategy={verticalListSortingStrategy}>
                    {applications.map(app => (
                        <ApplicationCard key={app._id} application={app} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
