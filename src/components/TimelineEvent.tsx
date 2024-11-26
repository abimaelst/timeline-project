import React from 'react';
import { format, parseISO } from 'date-fns';
import { GripHorizontalIcon } from 'lucide-react';
import { TimelineItem } from '../types';

interface TimelineEventProps {
    item: TimelineItem;
    style: React.CSSProperties;
    isDragging?: boolean;
    dragHandleProps?: any;
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

    return (
        <div
            style={style}
            className={`group bg-primary text-primary-content rounded-md p-2 text-xs overflow-hidden 
        shadow-md transition-all duration-200 ${
                isDragging ? 'opacity-70 z-50 cursor-grabbing' : 'opacity-100 cursor-grab'
            }`}
            data-tip={`${item.name}\n${formattedDateRange}`}
        >
            <div className="flex flex-col h-full tooltip tooltip-info" data-tip={`${item.name}\n${formattedDateRange}`}>
                <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-primary-content/70">
            {format(parseISO(item.start), 'MMM d')}
          </span>
                    <span className="text-xs text-primary-content/70">
            {format(parseISO(item.end), 'MMM d')}
          </span>
                </div>
                <div className="flex-grow flex items-center">
                    <div {...dragHandleProps} className="touch-none hover:bg-primary-focus/20 p-1 rounded mr-1">
                        <GripHorizontalIcon size={12} className="opacity-50 group-hover:opacity-100" />
                    </div>
                    <span className="truncate flex-1" title={item.name}>
            {item.name}
          </span>
                </div>
            </div>
        </div>
    );
};