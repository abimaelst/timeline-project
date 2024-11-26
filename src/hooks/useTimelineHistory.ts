import { useState, useCallback } from 'react';
import { TimelineItem } from '../types/timeline';

export const useTimelineHistory = (initialItems: TimelineItem[]) => {
    const [history, setHistory] = useState<TimelineItem[][]>([initialItems]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const pushState = useCallback(
        (items: TimelineItem[]) => {
            setHistory((prev) => [...prev.slice(0, currentIndex + 1), items]);
            setCurrentIndex((prev) => prev + 1);
        },
        [currentIndex]
    );

    const undo = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            return history[currentIndex - 1];
        }
        return history[currentIndex];
    }, [currentIndex, history]);

    const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            return history[currentIndex + 1];
        }
        return history[currentIndex];
    }, [currentIndex, history]);

    return {
        currentState: history[currentIndex],
        pushState,
        undo,
        redo,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
    };
};