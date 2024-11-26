# Timeline Component Implementation

## Time Spent
I spent approximately 4 hours on this assignment, broken down as follows:
- 2 hours on core timeline implementation and layout algorithm
- 1 hour on drag and drop functionality and date calculations
- 0.5 hours on zooming feature and tooltip implementation
- 0.5 hours on testing

## What I Like About My Implementation
1. **Efficient Layout Algorithm**
    - Events are automatically packed into lanes when there's no overlap
    - Handles edge cases like very short events or long names gracefully
    - Maintains readability while maximizing space efficiency

2. **Intuitive User Interactions**
    - Smooth zooming controls with clear visual feedback
    - Natural drag and drop behavior that updates dates intelligently
    - Helpful tooltips for events with truncated names

3. **Clean Code Architecture**
    - Separated concerns into reusable components
    - Custom hooks for data and calculations
    - Type-safe implementation with TypeScript

## What I Would Change
1. **Performance Optimizations**
    - Implement virtualization for large datasets
    - Optimize date calculations and memoization
    - Add debouncing for zoom operations

2. **Enhanced Features**
    - Add snapping to days when dragging
    - Implement inline name editing
    - Add keyboard navigation
    - Include a mini-map for large timelines

3. **Testing**
    - Add more comprehensive test coverage
    - Include integration tests
    - Add performance benchmarks

## Design Decisions
1. **Layout Algorithm**
    - Chose a greedy algorithm for lane allocation as it provides good results with O(n) complexity
    - Inspired by Gantt chart implementations but simplified for this use case
    - Looked at tools like Google Calendar, JIRA timeline and Git Project for UX inspiration

2. **Technology Choices**
    - Used @dnd-kit for drag and drop due to its accessibility and touch support
    - Implemented custom tooltip to ensure good performance
    - Chose Tailwind/DaisyUI for rapid styling while maintaining customization ability

3. **User Experience**
    - Added visual feedback for interactions
    - Made zooming logarithmic for better control
    - Used truncation with tooltips to balance information density and readability

## How I Would Test Further
1. **Unit Tests**
    - Test layout algorithm with various event configurations
    - Verify date calculations and updates
    - Test zoom behavior boundaries

2. **Integration Tests**
    - Test drag and drop interactions
    - Verify tooltip behavior
    - Test zoom controls

3. **User Testing**
    - Test with different screen sizes
    - Verify accessibility
    - Test with large datasets

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev:all

# Run tests
npm run test
```

### Available Scripts

### Docker Support

```bash
# Build docker image
npm run docker:build

# Run docker container
npm run docker:up

# Stop docker container
npm run docker:down
```

### Additional Scripts
```bash
# Format code
npm run format

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Implementation Notes
The timeline component accepts an array of events with the following structure:
```typescript
interface TimelineItem {
  id: number;
  start: string;     // YYYY-MM-DD format
  end: string;       // YYYY-MM-DD format
  name: string;
}
```

Key features implemented:
- Efficient event layout
- Zoom controls (0.5x to 3x)
- Drag and drop for date changes
- Tooltips for long event names
- Date range display

## Project Structure
```
src/
├── components/
│   ├── DraggableTimeline.tsx
│   ├── Timeline.tsx
│   ├── TimelineEvent.tsx
│   ├── TimelineControls.tsx
│   └── TimelineHeader.tsx
├── hooks/
│   ├── useTimelineData.ts
│   └── useTimelineCalculations.ts
├── types/
│   └── timeline.ts
├── services/
│   └── timelineService.ts
└── styles/
    └── tooltip.css
```

## Technologies Used
- React
- TypeScript
- Tailwind CSS
- DaisyUI
- @dnd-kit (Drag and Drop)
- date-fns
- Vitest
- React Testing Library
- Docker
