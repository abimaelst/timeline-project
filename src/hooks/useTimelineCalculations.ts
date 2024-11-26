import { useMemo } from 'react';
import { TimelineItem, TimelineLane } from '../types/timeline';
import { calculateDateRange } from '../utils/dateUtils';

export const useTimelineCalculations = (items: TimelineItem[]) => {
    return useMemo(() => {
        const { minDate, maxDate, totalDays } = calculateDateRange(items);
        const daysList = Array.from(
            { length: totalDays },
            (_, index) => new Date(minDate.getTime() + index * 24 * 60 * 60 * 1000)
        );

        return {
            minDate,
            maxDate,
            totalDays,
            daysList,
        };
    }, [items]);
};

export const useTimelineLayout = (items: TimelineItem[]) => {
    return useMemo(() => {
        const sortedItems = [...items].sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        );

        const lanes: TimelineLane[] = [];

        sortedItems.forEach((item) => {
            const laneIndex = lanes.findIndex((lane) =>
                lane.every(
                    (existingItem) =>
                        new Date(existingItem.end) < new Date(item.start) ||
                        new Date(item.end) < new Date(existingItem.start)
                )
            );

            if (laneIndex !== -1) {
                lanes[laneIndex].push(item);
            } else {
                lanes.push([item]);
            }
        });

        return lanes;
    }, [items]);
};