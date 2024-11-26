import React from 'react';

interface TimelineGridProps {
    daysList: Date[];
    totalDays: number;
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({ daysList, totalDays }) => (
    <div className="absolute inset-0 flex" style={{ marginTop: '80px' }}>
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
);