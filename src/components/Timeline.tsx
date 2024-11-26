import React, { useRef, useState } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { useTimelineData } from '../hooks/useTimelineData';
import { useTimelineCalculations, usePackedEvents } from '../hooks/useTimelineCalculations';
import { TimelineControls } from './TimelineControls';
import { TimelineHeader } from './TimelineHeader';
import { TimelineEvent } from './TimelineEvent';
import { TimelineItem } from '../types';
import { DraggableTimelineEvent } from './DraggableTimelineEvent.tsx';

interface TimelineProps {
  initialItems?: TimelineItem[];
  onItemUpdate?: (items: TimelineItem[]) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ initialItems = [], onItemUpdate }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const droppableRef = useDroppable({ id: 'timeline-droppable' }).setNodeRef;

  const { items, setItems, isLoading } = useTimelineData(initialItems);
  const { minDate, totalDays, daysList } = useTimelineCalculations(items);
  const packedEvents = usePackedEvents(items);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    setActiveId(null);

    const itemId = (active.id as string).replace('item-', '');
    const item = items.find((i) => i.id === Number(itemId));

    if (!item) return;

    const baseWidth = containerRef.current?.clientWidth ?? 0;
    const zoomedWidth = baseWidth * zoomLevel;
    const daysPerPixel = totalDays / zoomedWidth;
    const daysDelta = Math.round(delta.x * daysPerPixel);

    if (daysDelta === 0) return;

    const updatedItems = items.map((i) => {
      if (i.id === Number(itemId)) {
        return {
          ...i,
          start: format(addDays(parseISO(i.start), daysDelta), 'yyyy-MM-dd'),
          end: format(addDays(parseISO(i.end), daysDelta), 'yyyy-MM-dd'),
        };
      }
      return i;
    });

    setItems(updatedItems);
    onItemUpdate?.(updatedItems);
  };

  const zoomedWidth = (containerRef.current?.clientWidth ?? 0) * zoomLevel;

  return (
    <div className="bg-base-100 p-4 rounded-box shadow-lg">
      <TimelineControls zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} isLoading={isLoading} />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis]}
      >
        <div
          ref={(node) => {
            if (node) {
              containerRef.current = node;
              droppableRef(node);
            }
          }}
          className="relative w-full border border-base-300 overflow-x-auto"
          style={{
            height: `${packedEvents.length * 70 + 40}px`,
            width: '100%',
          }}
        >
          <div
            style={{
              width: `${zoomedWidth}px`,
              position: 'relative',
              minWidth: '100%',
            }}
          >
            <TimelineHeader daysList={daysList} totalDays={totalDays} />

            {/* Background Grid */}
            <div className="absolute inset-0 flex" style={{ marginTop: '40px' }}>
              {daysList.map((_, index) => (
                <div
                  key={index}
                  className="border-r border-base-300"
                  style={{
                    width: `${(1 / totalDays) * 100}%`,
                    height: '100%',
                  }}
                />
              ))}
            </div>

            {/* Events */}
            {packedEvents.map((lane, laneIndex) => (
              <React.Fragment key={laneIndex}>
                {lane.map((item) => (
                  <DraggableTimelineEvent
                    key={item.id}
                    item={item}
                    laneIndex={laneIndex}
                    zoomedWidth={zoomedWidth}
                    totalDays={totalDays}
                    minDate={minDate}
                  />
                ))}
              </React.Fragment>
            ))}

            {/* Drag Overlay */}
            <DragOverlay>
              {activeId && items.find((item) => `item-${item.id}` === activeId) && (
                <TimelineEvent
                  item={items.find((item) => `item-${item.id}` === activeId)!}
                  style={{
                    width: '100px',
                    height: '60px',
                  }}
                  isDragging={true}
                />
              )}
            </DragOverlay>
          </div>
        </div>
      </DndContext>
    </div>
  );
};
