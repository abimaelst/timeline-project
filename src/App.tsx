import React from 'react';
import { Timeline } from './components/Timeline';
import {TimelineItem} from "./types/timeline.ts";
import {timelineItems} from "./timelineItems.ts";


const App: React.FC = () => {
    const handleTimelineUpdate = (updatedItems: TimelineItem[]) => {
        console.log('Timeline updated:', updatedItems);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Timeline Visualization</h1>
            <Timeline
                initialItems={timelineItems}
                onItemUpdate={handleTimelineUpdate}
            />
        </div>
    );
};

export default App;