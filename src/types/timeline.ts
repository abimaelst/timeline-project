export interface TimelineItem {
  id: number;
  start: string;
  end: string;
  name: string;
}

export interface TimelineProps {
  initialItems?: TimelineItem[];
  onItemUpdate?: (items: TimelineItem[]) => void;
}

export interface TimelineState {
  items: TimelineItem[];
  zoomLevel: number;
  isDragging: boolean;
  selectedId: number | null;
}

export type TimelineLane = TimelineItem[];