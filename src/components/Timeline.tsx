import React, { useState, useMemo, useEffect, useRef } from 'react';
import { parseISO, differenceInDays, format, addDays, startOfDay } from 'date-fns';
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    useDraggable,
    useDroppable,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { TimelineService } from '../services/timelineService';
import { TimelineItem } from '../types';
import {
    ZoomInIcon,
    ZoomOutIcon,
    RefreshCwIcon,
    GripHorizontalIcon
} from 'lucide-react';

interface TimelineProps {
    initialItems?: TimelineItem[];
    onItemUpdate?: (items: TimelineItem[]) => void;
}

interface DraggableTimelineEventProps {
    item: TimelineItem;
    laneIndex: number;
    zoomedWidth: number;
    totalDays: number;
    minDate: Date;
}

const TimelineEvent: React.FC<DraggableTimelineEventProps & { isDragging?: boolean }> = ({
                                                                                             item,
                                                                                             laneIndex,
                                                                                             zoomedWidth,
                                                                                             totalDays,
                                                                                             minDate,
                                                                                             isDragging = false
                                                                                         }) => {
    const startOffset = differenceInDays(startOfDay(parseISO(item.start)), startOfDay(minDate));
    const eventWidth = differenceInDays(parseISO(item.end), parseISO(item.start)) + 1;
    const left = (startOffset / totalDays) * zoomedWidth;
    const width = (eventWidth / totalDays) * zoomedWidth;

    const style = {
        position: 'absolute' as const,
        left: `${left}px`,
        width: `${width}px`,
        top: `${(laneIndex * 70) + 40}px`,
        height: '60px',
    };

    return (
        <div
            style={style}
            className={`group bg-primary text-primary-content rounded-md p-2 text-xs overflow-hidden 
        shadow-md transition-all duration-200 ${isDragging ? 'opacity-70 z-50 cursor-grabbing' : 'opacity-100 cursor-grab'}`}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-primary-content/70">
            {format(parseISO(item.start), 'MMM d')}
          </span>
                    <span className="text-xs text-primary-content/70">
            {format(parseISO(item.end), 'MMM d')}
          </span>
                </div>
                <div className="flex-grow flex items-center">
                    <div className="touch-none hover:bg-primary-focus/20 p-1 rounded mr-1">
                        <GripHorizontalIcon size={12} className="opacity-50 group-hover:opacity-100" />
                    </div>
                    {item.name}
                </div>
            </div>
        </div>
    );
};

const DraggableTimelineEvent: React.FC<DraggableTimelineEventProps> = (props) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `item-${props.item.id}`,
        data: props.item,
    });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                position: 'absolute',
                top: 14,
                left: 0,
                width: '100%',
                height: '100%',
                transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
            }}
        >
            <TimelineEvent {...props} isDragging={isDragging} />
        </div>
    );
};

export const Timeline: React.FC<TimelineProps> = ({
                                                      initialItems = [],
                                                      onItemUpdate
                                                  }) => {
    const [items, setItems] = useState<TimelineItem[]>(initialItems);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const droppableRef = useDroppable({ id: 'timeline-droppable' }).setNodeRef;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

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

    const { minDate, totalDays, daysList } = useMemo(() => {
        if (items.length === 0) return {
            minDate: new Date(),
            maxDate: new Date(),
            totalDays: 1,
            daysList: []
        };

        const dates = items.flatMap(item => [item.start, item.end]);
        // @ts-expect-error
        const minDate = startOfDay(new Date(Math.min(...dates.map(d => new Date(d)))));
        // @ts-expect-error
        const maxDate = startOfDay(new Date(Math.max(...dates.map(d => new Date(d)))));
        const totalDays = differenceInDays(maxDate, minDate) + 1;

        const daysList = Array.from({ length: totalDays }, (_, index) =>
            addDays(minDate, index)
        );

        return { minDate, maxDate, totalDays, daysList };
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

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        setActiveId(null);

        const itemId = (active.id as string).replace('item-', '');
        const item = items.find(i => i.id === Number(itemId));

        if (!item) return;

        const baseWidth = containerRef.current?.clientWidth ?? 0;
        const zoomedWidth = baseWidth * zoomLevel;
        const daysPerPixel = totalDays / zoomedWidth;
        const daysDelta = Math.round(delta.x * daysPerPixel);

        if (daysDelta === 0) return;

        const updatedItems = items.map(i => {
            if (i.id === Number(itemId)) {
                return {
                    ...i,
                    start: format(addDays(parseISO(i.start), daysDelta), 'yyyy-MM-dd'),
                    end: format(addDays(parseISO(i.end), daysDelta), 'yyyy-MM-dd')
                };
            }
            return i;
        });

        setItems(updatedItems);
        onItemUpdate?.(updatedItems);
    };

    const zoomedWidth = (containerRef.current?.clientWidth ?? 0) * zoomLevel;

    return (
        <div className="bg-base-100 p-4 rounded-box shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <button
                        className="btn btn-circle btn-sm btn-outline"
                        onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.5))}
                        disabled={zoomLevel <= 0.5}
                    >
                        <ZoomOutIcon size={16} />
                    </button>
                    <span className="text-sm">Zoom: {zoomLevel}x</span>
                    <button
                        className="btn btn-circle btn-sm btn-outline"
                        onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
                        disabled={zoomLevel >= 3}
                    >
                        <ZoomInIcon size={16} />
                    </button>
                </div>

                {isLoading && (
                    <div className="flex items-center gap-2">
                        <RefreshCwIcon size={16} className="animate-spin" />
                        <span>Loading...</span>
                    </div>
                )}
            </div>

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToHorizontalAxis]}
            >
                <div
                    ref={(node) => {
                        if (node) {
                            containerRef.current = node;
                            droppableRef(node);
                        }
                    }}
                    className="relative w-full border border-base-300 overflow-x-auto"
                    style={{
                        height: `${(packedEvents.length * 70) + 40}px`,
                        width: '100%'
                    }}
                >
                    <div
                        style={{
                            width: `${zoomedWidth}px`,
                            position: 'relative',
                            minWidth: '100%'
                        }}
                    >
                        <div className="sticky top-0 left-0 z-10 bg-base-100">
                            <div className="flex h-5 border-b border-base-300">
                                {Array.from(new Set(daysList.map(date => format(date, 'MMM yyyy')))).map((month) => {
                                    const daysInMonth = daysList.filter(date =>
                                        format(date, 'MMM yyyy') === month
                                    ).length;
                                    return (
                                        <div
                                            key={month}
                                            className="border-r border-base-300 text-xs font-medium px-2 flex items-center"
                                            style={{
                                                width: `${(daysInMonth / totalDays) * 100}%`
                                            }}
                                        >
                                            {month}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex h-8 border-b border-base-300">
                                {daysList.map((date, index) => (
                                    <div
                                        key={index}
                                        className="border-r border-base-300 text-xs px-1 flex items-center justify-center"
                                        style={{
                                            width: `${(1 / totalDays) * 100}%`
                                        }}
                                    >
                                        {format(date, 'd')}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="absolute left-0 top-4  flex z-50" style={{ marginTop: '80px' }}>
                            {daysList.map((_, index) => (
                                <div
                                    key={index}
                                    className="border-r border-base-300"
                                    style={{
                                        width: `${(1 / totalDays) * 100}%`,
                                        height: '100%'
                                    }}
                                />
                            ))}
                        </div>

                        {packedEvents.map((lane, laneIndex) => (
                            <React.Fragment key={laneIndex}>
                                {lane.map((item) => (
                                    <DraggableTimelineEvent
                                        key={item.id}
                                        item={item}
                                        laneIndex={laneIndex}
                                        zoomedWidth={zoomedWidth}
                                        totalDays={totalDays}
                                        minDate={minDate}
                                    />
                                ))}
                            </React.Fragment>
                        ))}

                        <DragOverlay>
                            {activeId && items.find(item => `item-${item.id}` === activeId) && (
                                <TimelineEvent
                                    item={items.find(item => `item-${item.id}` === activeId)!}
                                    laneIndex={0}
                                    zoomedWidth={zoomedWidth}
                                    totalDays={totalDays}
                                    minDate={minDate}
                                    isDragging={true}
                                />
                            )}
                        </DragOverlay>
                    </div>
                </div>
            </DndContext>
        </div>
    );
};
