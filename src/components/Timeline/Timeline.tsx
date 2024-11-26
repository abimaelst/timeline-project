import React, {useEffect, useRef, useState} from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { TimelineProps } from '../../types/timeline';
import { useTimelineData } from '../../hooks/useTimelineData';
import { useTimelineCalculations, useTimelineLayout } from '../../hooks/useTimelineCalculations';
import { useTimelineHistory } from '../../hooks/useTimelineHistory';
import { TimelineContainer } from './TimelineContainer';
import { TimelineControls } from './TimelineControls';
import { TimelineErrorBoundary } from '../common/TimelineErrorBoundary';
import { updateItemDates } from '../../utils/dateUtils';

export const Timeline: React.FC<TimelineProps> = ({ initialItems = [], onItemUpdate }) => {
    const { items, setItems, updateItemDates: updateDates } = useTimelineData(initialItems);
    const { minDate, totalDays, daysList } = useTimelineCalculations(items);
    const packedEvents = useTimelineLayout(items);
    const { pushState, undo, redo, canUndo, canRedo } = useTimelineHistory(items);
    const [zoomLevel, setZoomLevel] = useState(0.5);
    const containerRef = useRef<HTMLDivElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        const itemId = Number((active.id as string).replace('item-', ''));

        const baseWidth = containerRef.current?.clientWidth ?? 0;
        const zoomedWidth = baseWidth * zoomLevel;
        const daysPerPixel = totalDays / zoomedWidth;
        const daysDelta = Math.round(delta.x * daysPerPixel);

        if (daysDelta !== 0) {
            const newItems = items.map(item =>
                item.id === itemId ? updateItemDates(item, daysDelta) : item
            );
            setItems(newItems);
            pushState(newItems);
            onItemUpdate?.(newItems);
        }
    };

    const zoomedWidth = (containerRef.current?.clientWidth ?? 0) * zoomLevel;

    useEffect(() => {
        setZoomLevel(1)
    },[])

    return (
        <TimelineErrorBoundary>
            <div className="bg-base-100 p-4 rounded-box shadow-lg">
                <TimelineControls
                    zoomLevel={zoomLevel}
                    setZoomLevel={setZoomLevel}
                    onUndo={canUndo ? undo : undefined}
                    onRedo={canRedo ? redo : undefined}
                />

                <DndContext
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToHorizontalAxis]}
                >
                    <TimelineContainer
                        containerRef={containerRef}
                        zoomedWidth={zoomedWidth}
                        daysList={daysList}
                        totalDays={totalDays}
                        minDate={minDate}
                        packedEvents={packedEvents}
                    />
                </DndContext>
            </div>
        </TimelineErrorBoundary>
    );
};