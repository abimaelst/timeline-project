import React, {useState, useMemo, useEffect, useRef} from 'react';
import { parseISO, differenceInDays, format } from 'date-fns';
import {
    ZoomInIcon,
    ZoomOutIcon,
    RefreshCwIcon
} from 'lucide-react';
import {TimelineItem} from "../types";
import {TimelineService} from "../services/TimelineService.ts";

interface TimelineProps {
    initialItems?: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ initialItems = [] }) => {
    const [items, setItems] = useState<TimelineItem[]>(initialItems);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const fetchedItems = await TimelineService.getTimelineItems();
                setItems(fetchedItems);
            } catch (error) {
                console.error('Failed to fetch timeline items', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (initialItems.length === 0) {
            fetchItems();
        }
    }, []);

    const { minDate, maxDate, totalDays } = useMemo(() => {
        if (items.length === 0) return { minDate: new Date(), maxDate: new Date(), totalDays: 1 };

        const dates = items.flatMap(item => [item.start, item.end]);
        const minDate = new Date(Math.min(...dates.map(d => new Date(d))));
        const maxDate = new Date(Math.max(...dates.map(d => new Date(d))));
        const totalDays = differenceInDays(maxDate, minDate) + 1;

        return { minDate, maxDate, totalDays };
    }, [items]);

    const packedEvents = useMemo(() => {
        const sortedItems = [...items].sort((a, b) =>
            new Date(a.start).getTime() - new Date(b.start).getTime()
        );

        const lanes: TimelineItem[][] = [];

        sortedItems.forEach(item => {
            const laneIndex = lanes.findIndex(lane =>
                lane.every(existingItem =>
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

    const calculateEventStyle = (item: TimelineItem, laneIndex: number): object => {
        const startOffset = differenceInDays(parseISO(item.start), minDate);
        const eventWidth = differenceInDays(parseISO(item.end), parseISO(item.start)) + 1;

        const baseWidth = containerRef.current ? containerRef.current.clientWidth : 0;
        const zoomedWidth = baseWidth * zoomLevel;

        return {
            position: 'absolute',
            left: `${(startOffset / totalDays) * zoomedWidth}px`,
            width: `${(eventWidth / totalDays) * zoomedWidth}px`,
            top: `${laneIndex * 50}px`,
            height: '40px',
        };
    };

    return (
        <div className="bg-base-100 p-4 rounded-box shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <button
                        className="btn btn-circle btn-sm btn-outline"
                        onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.5))}
                    >
                        <ZoomOutIcon size={16} />
                    </button>
                    <span className="text-sm">Zoom: {zoomLevel}x</span>
                    <button
                        className="btn btn-circle btn-sm btn-outline"
                        onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
                    >
                        <ZoomInIcon size={16} />
                    </button>
                </div>

                {isLoading && (
                    <button
                        className="btn btn-ghost loading"
                        disabled
                    >
                        <RefreshCwIcon size={16} className="mr-2" />
                        Loading...
                    </button>
                )}
            </div>

            <div
                ref={containerRef}
                className="relative w-full border-l border-r border-base-300 overflow-x-auto"
                style={{
                    height: `${packedEvents.length * 50}px`,
                    width: '100%'
                }}
            >
                <div
                    style={{
                        width: containerRef.current ?
                            `${containerRef.current.clientWidth * zoomLevel}px` : '100%'
                    }}
                >
                    <div
                        className="absolute top-0 left-0 right-0 h-8 flex"
                        style={{
                            width: containerRef.current ?
                                `${containerRef.current.clientWidth * zoomLevel}px` : '100%'
                        }}
                    >
                        {[...Array(Math.ceil(totalDays / 30))].map((_, index) => {
                            const monthStart = new Date(minDate.getFullYear(), minDate.getMonth() + index, 1);
                            return (
                                <div
                                    key={index}
                                    className="flex-1 border-r border-base-300 text-xs pl-1"
                                    style={{
                                        width: `${(30 / totalDays) * 100}%`
                                    }}
                                >
                                    {format(monthStart, 'MMM yyyy')}
                                </div>
                            );
                        })}
                    </div>

                    {packedEvents.map((lane, laneIndex) => (
                        lane.map(item => (
                            <div
                                key={item.id}
                                className="absolute bg-primary text-primary-content rounded-md p-2 text-xs overflow-hidden whitespace-nowrap text-ellipsis shadow-md"
                                style={calculateEventStyle(item, laneIndex)}
                                title={item.name}
                            >
                                {item.name}
                            </div>
                        ))
                    ))}
                </div>
            </div>
        </div>
    );
};