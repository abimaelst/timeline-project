import { useState, useEffect } from 'react';
import { TimelineItem } from '../types';
import { TimelineService } from '../services/timelineService.ts';

export const useTimelineData = (initialItems: TimelineItem[] = []) => {
    const [items, setItems] = useState<TimelineItem[]>(initialItems);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const fetchedItems = await TimelineService.getTimelineItems();
                setItems(fetchedItems);
            } catch (error) {
                console.error('Failed to fetch timeline items:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (initialItems.length === 0) {
            fetchItems();
        }
    }, []);

    return { items, setItems, isLoading };
};