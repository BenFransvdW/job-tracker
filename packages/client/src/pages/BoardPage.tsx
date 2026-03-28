import { useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { Application, ApplicationStatus } from '@job-tracker/shared';
import { APPLICATION_STATUSES, QUERY_KEYS } from '@job-tracker/shared';
import { useApplications } from '../hooks/useApplications';
import { KanbanColumn } from '../components/kanban/KanbanColumn';
import { AppDragOverlay } from '../components/kanban/DragOverlay';
import { Modal } from '../components/ui/Modal';
import { AddApplicationForm } from '../components/forms/AddApplicationForm';
import { useQueryClient } from '@tanstack/react-query';
import { reorderApplications } from '../api/applications';

export function BoardPage() {
    const { data, isLoading } = useApplications();
    const queryClient = useQueryClient();
    const [activeApp, setActiveApp] = useState<Application | null>(null);
    const [addOpen, setAddOpen] = useState(false);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
    const applications = data?.data ?? [];

    const byStatus = APPLICATION_STATUSES.reduce((acc, s) => {
        acc[s] = applications.filter(a => a.status === s).sort((a, b) => a.boardPosition - b.boardPosition);
        return acc;
    }, {} as Record<ApplicationStatus, Application[]>);

    function handleDragStart(e: DragStartEvent) {
        const app = applications.find(a => a._id === e.active.id);
        setActiveApp(app ?? null);
    }

    async function handleDragEnd(e: DragEndEvent) {
        setActiveApp(null);
        const { over } = e;
        if (!over || !activeApp) return;

        const newStatus = (over.id as string) in byStatus ? over.id as ApplicationStatus : activeApp.status;

        if (newStatus !== activeApp.status) {
            queryClient.setQueryData([...QUERY_KEYS.applications], (old: any) => {
                if (!old?.data) return old;
                return { ...old, data: old.data.map((a: Application) => a._id === activeApp._id ? { ...a, status: newStatus } : a) };
            });
            try {
                await reorderApplications(activeApp._id, [activeApp._id], newStatus);
            } catch {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications });
            }
        }
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications });
    }

    if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading...</p></div>;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Job Board</h1>
                <button onClick={() => setAddOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">
                    + Add Application
                </button>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {APPLICATION_STATUSES.map(status => (
                        <KanbanColumn key={status} status={status} applications={byStatus[status]} />
                    ))}
                </div>
                <AppDragOverlay activeApplication={activeApp} />
            </DndContext>
            <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Application">
                <AddApplicationForm onSuccess={() => setAddOpen(false)} />
            </Modal>
        </div>
    );
}
