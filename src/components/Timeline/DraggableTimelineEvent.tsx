import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TimelineEvent } from './TimelineEvent';
import { TimelineItem } from '../../types/timeline';
import { calculateEventPosition, calculateEventWidth } from '../../utils/dateUtils';

interface DraggableTimelineEventProps {
  item: TimelineItem;
  laneIndex: number;
  zoomedWidth: number;
  totalDays: number;
  minDate: Date;
}

const MARGIN_TOP = 51;
const ITEM_HEIGHT = 70;

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

  const left = calculateEventPosition(item.start, minDate, totalDays, zoomedWidth);
  const width = calculateEventWidth(item.start, item.end, totalDays, zoomedWidth);

  const style = {
    position: 'absolute' as const,
    left: `${left}px`,
    width: `${width}px`,
    top: `${laneIndex * ITEM_HEIGHT + MARGIN_TOP}px`,
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
