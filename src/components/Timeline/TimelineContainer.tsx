import React from 'react';
import { TimelineGrid } from './TimelineGrid';
import { TimelineHeader } from './TimelineHeader';
import { DraggableTimelineEvent } from './DraggableTimelineEvent';
import { TimelineItem } from '../../types/timeline';

interface TimelineContainerProps {
    containerRef: React.RefObject<HTMLDivElement>;
    zoomedWidth: number;
    daysList: Date[];
    totalDays: number;
    minDate: Date;
    packedEvents: TimelineItem[][];
}

export const TimelineContainer: React.FC<TimelineContainerProps> = ({
                                                                        containerRef,
                                                                        zoomedWidth,
                                                                        daysList,
                                                                        totalDays,
                                                                        minDate,
                                                                        packedEvents,
                                                                    }) => {
    return (
        <div
            ref={containerRef}
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
                <TimelineGrid daysList={daysList} totalDays={totalDays} />

                {packedEvents.map((lane, laneIndex) =>
                    lane.map((item) => (
                        <DraggableTimelineEvent
                            key={item.id}
                            item={item}
                            laneIndex={laneIndex}
                            zoomedWidth={zoomedWidth}
                            totalDays={totalDays}
                            minDate={minDate}
                        />
                    ))
                )}
            </div>
        </div>
    );
};