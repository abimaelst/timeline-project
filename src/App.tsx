import React, { useEffect, useState } from 'react';
import { Timeline } from './components/Timeline';
import { TimelineItem } from './types/timeline';
import { AlertCircle, Loader2 } from 'lucide-react';
import {TimelineService} from "./services/timelineService.ts";

const App: React.FC = () => {
    const [items, setItems] = useState<TimelineItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTimelineItems();
    }, []);

    const fetchTimelineItems = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await TimelineService.getTimelineItems();
            setItems(data);
        } catch (err) {
            setError('Failed to load timeline items. Please try again later.');
            console.error('Error fetching timeline items:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTimelineUpdate = async (updatedItems: TimelineItem[]) => {
        try {
            const changedItem = updatedItems.find((item, index) => {
                const currentItem = items[index];
                return JSON.stringify(item) !== JSON.stringify(currentItem);
            });

            if (changedItem) {
                await TimelineService.updateTimelineItem(changedItem);
                await fetchTimelineItems();
            }
        } catch (err) {
            console.error('Error updating timeline item:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin mr-2" size={24} />
                <span>Loading timeline...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-error">
                <AlertCircle className="mb-2" size={24} />
                <p>{error}</p>
                <button
                    onClick={fetchTimelineItems}
                    className="btn btn-error btn-sm mt-4"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Timeline Visualization</h1>
                <button
                    onClick={fetchTimelineItems}
                    className="btn btn-ghost btn-sm"
                >
                    Refresh
                </button>
            </div>
            <Timeline
                initialItems={items}
                onItemUpdate={handleTimelineUpdate}
            />
        </div>
    );
};

export default App;