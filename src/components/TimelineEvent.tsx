import React from 'react';
import { format, parseISO } from 'date-fns';
import { GripHorizontalIcon } from 'lucide-react';
import { TimelineItem } from '../types';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface TimelineEventProps {
  item: TimelineItem;
  style: React.CSSProperties;
  isDragging?: boolean;
  dragHandleProps?: SyntheticListenerMap | undefined;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  item,
  style,
  isDragging = false,
  dragHandleProps,
}) => {
  const formattedDateRange = `${format(parseISO(item.start), 'MMM d, yyyy')} - ${format(
    parseISO(item.end),
    'MMM d, yyyy'
  )}`;

  const tooltipContent = `${item.name}\n${formattedDateRange}`;

  return (
    <div
      style={style}
      className={`
        relative
        group
        bg-primary 
        text-primary-content 
        rounded-md 
        p-2 
        text-xs 
        overflow-visible
        shadow-md 
        transition-all 
        duration-200
        hover:z-50
        ${isDragging ? 'opacity-70 z-50 cursor-grabbing' : 'opacity-100 cursor-grab'}
      `}
    >
      <div
        className="tooltip tooltip-info tooltip-top absolute -top-2 left-1/2 transform -translate-x-1/2"
        data-tip={tooltipContent}
      >
        <div className="flex flex-col h-full w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-primary-content/70">
              {format(parseISO(item.start), 'MMM d')}
            </span>
            <span className="text-xs text-primary-content/70">
              {format(parseISO(item.end), 'MMM d')}
            </span>
          </div>
          <div className="flex-grow flex items-center">
            <div
              {...dragHandleProps}
              className="touch-none hover:bg-primary-focus/20 p-1 rounded mr-1"
            >
              <GripHorizontalIcon size={12} className="opacity-50 group-hover:opacity-100" />
            </div>
            <span className="truncate flex-1">{item.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
