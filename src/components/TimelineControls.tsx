import React from 'react';
import { ZoomInIcon, ZoomOutIcon, RefreshCwIcon } from 'lucide-react';

interface TimelineControlsProps {
    zoomLevel: number;
    setZoomLevel: (level: number) => void;
    isLoading: boolean;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
                                                                      zoomLevel,
                                                                      setZoomLevel,
                                                                      isLoading,
                                                                  }) => (
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
);