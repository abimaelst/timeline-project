import React from 'react';
import { format, parseISO } from 'date-fns';
import { GripHorizontalIcon } from 'lucide-react';
import { TimelineItem } from '../types';
import {SyntheticListenerMap} from "@dnd-kit/core/dist/hooks/utilities";

interface TimelineEventProps {
    item: TimelineItem;
    style: React.CSSProperties;
    isDragging?: boolean;
    dragHandleProps?:  SyntheticListenerMap | undefined;
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
            data-tip={tooltipContent}
            className={`
        relative
        tooltip
        tooltip-secondary 
        tooltip-top
        bg-primary 
        text-primary-content 
        rounded-md 
        p-2 
        text-xs 
        shadow-md 
        transition-all 
        duration-200
        ${isDragging ? 'opacity-70 cursor-grabbing' : 'opacity-100 cursor-grab'}
      `}
        >

            <div className="flex flex-col h-full">

                <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-primary-content/70 whitespace-nowrap">
            {format(parseISO(item.start), 'MMM d')}
          </span>
                    <span className="text-xs text-primary-content/70 whitespace-nowrap">
            {format(parseISO(item.end), 'MMM d')}
          </span>
                </div>


                <div className="flex items-center min-w-0">
                    <div
                        {...dragHandleProps}
                        className="touch-none hover:bg-primary-focus/20 p-1 rounded mr-1 flex-shrink-0"
                    >
                        <GripHorizontalIcon size={12} className="opacity-50 group-hover:opacity-100" />
                    </div>
                    <div className="min-w-0 flex-1">
            <span className="block truncate">
              {item.name}
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
};