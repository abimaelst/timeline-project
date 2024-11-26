import { TimelineItem } from '../types';
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { differenceInDays, parseISO } from 'date-fns';
import { TimelineEvent } from './TimelineEvent.tsx';

interface DraggableTimelineEventProps {
  item: TimelineItem;
  laneIndex: number;
  zoomedWidth: number;
  totalDays: number;
  minDate: Date;
}

const MARGIN_TOP = 51;
const LINE_HEIGHT = 70;

export const DraggableTimelineEvent: React.FC<DraggableTimelineEventProps> = ({
  item,
  laneIndex,
  zoomedWidth,
  totalDays,
  minDate,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `item-${item.id}`,
    data: item,
  });

  const startOffset = differenceInDays(parseISO(item.start), minDate);
  const eventWidth = differenceInDays(parseISO(item.end), parseISO(item.start)) + 1;

  const left = (startOffset / totalDays) * zoomedWidth;
  const width = (eventWidth / totalDays) * zoomedWidth;

  const style = {
    position: 'absolute' as const,
    left: `${left}px`,
    width: `${width}px`,
    top: `${laneIndex * LINE_HEIGHT + MARGIN_TOP}px`,
    height: '60px',
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className={`absolute transition-transform ${isDragging ? 'z-50' : 'z-0'}`}
      style={style}
    >
      <TimelineEvent
        item={item}
        isDragging={isDragging}
        dragHandleProps={listeners}
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    </div>
  );
};
