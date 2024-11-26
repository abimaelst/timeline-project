import { useState, useCallback } from 'react';
import { TimelineItem } from '../types/timeline';

export const useTimelineData = (initialItems: TimelineItem[] = []) => {
    const [items, setItems] = useState<TimelineItem[]>(initialItems);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const updateItem = useCallback((updatedItem: TimelineItem) => {
        setItems((prevItems) =>
            prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
    }, []);

    const updateItemDates = useCallback((id: number, start: string, end: string) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, start, end } : item
            )
        );
    }, []);

    const updateItemName = useCallback((id: number, name: string) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, name } : item
            )
        );
    }, []);

    return {
        items,
        setItems,
        selectedId,
        setSelectedId,
        updateItem,
        updateItemDates,
        updateItemName,
    };
};