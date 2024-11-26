import { useMemo } from 'react';
import { startOfDay, addDays, differenceInDays, parseISO } from 'date-fns';
import { TimelineItem } from '../types';

export const useTimelineCalculations = (items: TimelineItem[]) => {
  return useMemo(() => {
    if (items.length === 0) {
      return {
        minDate: new Date(),
        maxDate: new Date(),
        totalDays: 1,
        daysList: [],
      };
    }

    const parsedDates = items.reduce(
      (acc, item) => {
        const startDate = startOfDay(parseISO(item.start));
        const endDate = startOfDay(parseISO(item.end));

        return {
          minDate: startDate < acc.minDate ? startDate : acc.minDate,
          maxDate: endDate > acc.maxDate ? endDate : acc.maxDate,
        };
      },
      {
        minDate: startOfDay(parseISO(items[0].start)),
        maxDate: startOfDay(parseISO(items[0].end)),
      }
    );

    const totalDays = differenceInDays(parsedDates.maxDate, parsedDates.minDate) + 1;

    const daysList = Array.from({ length: totalDays }, (_, index) =>
      addDays(parsedDates.minDate, index)
    );

    return {
      minDate: parsedDates.minDate,
      maxDate: parsedDates.maxDate,
      totalDays,
      daysList,
    };
  }, [items]);
};

export const usePackedEvents = (items: TimelineItem[]) => {
  return useMemo(() => {
    const sortedItems = [...items].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    const lanes: TimelineItem[][] = [];

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
