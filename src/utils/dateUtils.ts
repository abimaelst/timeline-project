import { parseISO, format, differenceInDays, addDays, startOfDay } from 'date-fns';
import { TimelineItem } from '../types/timeline';

export const calculateDateRange = (items: TimelineItem[]) => {
    if (items.length === 0) {
        return {
            minDate: new Date(),
            maxDate: new Date(),
            totalDays: 1,
        };
    }

    const dates = items.flatMap((item) => [parseISO(item.start), parseISO(item.end)]);
    const minDate = startOfDay(new Date(Math.min(...dates.map((d) => d.getTime()))));
    const maxDate = startOfDay(new Date(Math.max(...dates.map((d) => d.getTime()))));
    const totalDays = differenceInDays(maxDate, minDate) + 1;

    return { minDate, maxDate, totalDays };
};

export const updateItemDates = (
    item: TimelineItem,
    daysDelta: number
): TimelineItem => {
    return {
        ...item,
        start: format(addDays(parseISO(item.start), daysDelta), 'yyyy-MM-dd'),
        end: format(addDays(parseISO(item.end), daysDelta), 'yyyy-MM-dd'),
    };
};

export const formatDateRange = (start: string, end: string): string => {
    return `${format(parseISO(start), 'MMM d, yyyy')} - ${format(
        parseISO(end),
        'MMM d, yyyy'
    )}`;
};

export const calculateEventPosition = (
    start: string,
    minDate: Date,
    totalDays: number,
    containerWidth: number
): number => {
    const startOffset = differenceInDays(parseISO(start), minDate);
    return (startOffset / totalDays) * containerWidth;
};

export const calculateEventWidth = (
    start: string,
    end: string,
    totalDays: number,
    containerWidth: number
): number => {
    const duration = differenceInDays(parseISO(end), parseISO(start)) + 1;
    return (duration / totalDays) * containerWidth;
};