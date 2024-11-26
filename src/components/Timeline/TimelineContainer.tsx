import React, { useEffect, useState } from 'react';
import { TimelineGrid } from './TimelineGrid';
import { TimelineHeader } from './TimelineHeader';
import { DraggableTimelineEvent } from './DraggableTimelineEvent';
import { TimelineItem } from '../../types/timeline';

interface TimelineContainerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  zoomLevel: number;
  daysList: Date[];
  totalDays: number;
  minDate: Date;
  packedEvents: TimelineItem[][];
}
const MARGIN_TOP = 57;

export const TimelineContainer: React.FC<TimelineContainerProps> = ({
  containerRef,
  zoomLevel,
  daysList,
  totalDays,
  minDate,
  packedEvents,
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }
  }, []);

  const zoomedWidth = Math.max(containerWidth * zoomLevel, containerWidth);

  return (
    <div
      ref={containerRef}
      className="relative w-full border border-base-300 overflow-x-auto"
      style={{
        height: `${packedEvents.length * 71 + MARGIN_TOP}px`,
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
