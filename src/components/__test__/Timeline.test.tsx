import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeline } from '../Timeline';
import { TimelineItem } from '../../types';

const mockItems: TimelineItem[] = [
    {
        id: 1,
        start: "2024-01-01",
        end: "2024-01-05",
        name: "Test Event 1"
    },
    {
        id: 2,
        start: "2024-01-06",
        end: "2024-01-10",
        name: "Test Event 2 with a very long name that should be truncated"
    }
];

describe('Timeline Component', () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        vi.resetAllMocks();
    });

    describe('Initial Render', () => {
        it('should render all timeline events', () => {
            render(<Timeline initialItems={mockItems} />);

            expect(screen.getByText('Test Event 1')).toBeInTheDocument();
        });

        it('should start with zoom level at 1x', () => {

            render(<Timeline initialItems={mockItems} />);

            expect(screen.getByText('Zoom: 1x')).toBeInTheDocument();
        });

        it('should truncate long event names', () => {

            render(<Timeline initialItems={mockItems} />);
            const longNameEvent = screen.getByText('Test Event 2 with a very long name that should be truncated');


            expect(longNameEvent.className).toContain('truncate');
        });
    });

    describe('Tooltip Behavior', () => {
        it('should show tooltip with full event information', () => {
            render(<Timeline initialItems={mockItems} />);
            const event = screen.getByText('Test Event 1');
            const tooltipContainer = event.closest('.tooltip');

            expect(tooltipContainer).toHaveAttribute(
                'data-tip',
                expect.stringContaining('Test Event 1\nJan 1, 2024 - Jan 5, 2024')
            );
        });

        it('should show tooltip with date range for long event names', () => {
            render(<Timeline initialItems={mockItems} />);
            const event = screen.getByText('Test Event 2 with a very long name that should be truncated');
            const tooltipContainer = event.closest('.tooltip');

            expect(tooltipContainer).toHaveAttribute(
                'data-tip',
                expect.stringContaining('Jan 6, 2024 - Jan 10, 2024')
            );
        });
    });

    describe('Date Display', () => {
        it('should display event start date correctly', () => {

            render(<Timeline initialItems={mockItems} />);

            expect(screen.getByText('Jan 1')).toBeInTheDocument();
        });

        it('should display event end date correctly', () => {

            render(<Timeline initialItems={mockItems} />);

            expect(screen.getByText('Jan 5')).toBeInTheDocument();
        });
    });
});