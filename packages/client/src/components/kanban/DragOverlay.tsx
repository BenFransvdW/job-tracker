import { DragOverlay as DndDragOverlay } from '@dnd-kit/core';
import type { Application } from '@job-tracker/shared';
import { ApplicationCard } from './ApplicationCard';

interface DragOverlayProps {
    activeApplication: Application | null;
}

export function AppDragOverlay({ activeApplication }: DragOverlayProps) {
    return (
        <DndDragOverlay>
            {activeApplication && <ApplicationCard application={activeApplication} overlay />}
        </DndDragOverlay>
    );
}
