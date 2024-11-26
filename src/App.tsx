import { Timeline } from "./components/Timeline.tsx";

function App() {


  return (
      <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
              Project Timeline Visualization
          </h1>
          <Timeline />
      </div>
  )
}

export default App
