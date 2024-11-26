import React from 'react';
import { ZoomInIcon, ZoomOutIcon, UndoIcon, RedoIcon } from 'lucide-react';

interface TimelineControlsProps {
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.5

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  zoomLevel,
  setZoomLevel,
  onUndo,
  onRedo,
}) => (
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center space-x-2">
      <button
        className="btn btn-circle btn-sm btn-outline"
        onClick={() => setZoomLevel(Math.max(ZOOM_STEP, zoomLevel - ZOOM_STEP))}
        disabled={zoomLevel <= MIN_ZOOM}
      >
        <ZoomOutIcon size={16} />
      </button>
      <span className="text-sm">Zoom: {zoomLevel}x</span>
      <button
        className="btn btn-circle btn-sm btn-outline"
        onClick={() => setZoomLevel(Math.min(3, zoomLevel + ZOOM_STEP))}
        disabled={zoomLevel >= MAX_ZOOM}
      >
        <ZoomInIcon size={16} />
      </button>
    </div>

    <div className="flex items-center space-x-2">
      <button className="btn btn-circle btn-sm btn-outline" onClick={onUndo} disabled={!onUndo}>
        <UndoIcon size={16} />
      </button>
      <button className="btn btn-circle btn-sm btn-outline" onClick={onRedo} disabled={!onRedo}>
        <RedoIcon size={16} />
      </button>
    </div>
  </div>
);
