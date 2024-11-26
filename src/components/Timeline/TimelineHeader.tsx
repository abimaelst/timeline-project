import React from 'react';
import { format } from 'date-fns';

interface TimelineHeaderProps {
  daysList: Date[];
  totalDays: number;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({ daysList, totalDays }) => (
  <div className="sticky top-0 left-0 z-10 bg-base-100">
    {/* Month Labels */}
    <div className="flex h-5 border-b border-base-300">
      {Array.from(new Set(daysList.map((date) => format(date, 'MMM yyyy')))).map((month) => {
        const daysInMonth = daysList.filter((date) => format(date, 'MMM yyyy') === month).length;
        return (
          <div
            key={month}
            className="border-r border-base-300 text-xs font-medium px-2 flex items-center"
            style={{
              width: `${(daysInMonth / totalDays) * 100}%`,
            }}
          >
            {month}
          </div>
        );
      })}
    </div>

    {/* Day Labels */}
    <div className="flex h-8 border-b border-base-300">
      {daysList.map((date, index) => (
        <div
          key={index}
          className="border-r border-base-300 text-xs px-1 flex items-center justify-center"
          style={{
            width: `${(1 / totalDays) * 100}%`,
          }}
        >
          {format(date, 'd')}
        </div>
      ))}
    </div>
  </div>
);
