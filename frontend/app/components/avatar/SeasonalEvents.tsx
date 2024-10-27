import { useFetcher } from "@remix-run/react";
import { ErrorBoundary } from "react-error-boundary";
import { AvatarComponentErrorBoundary } from "./shared/AvatarComponentErrorBoundary";

interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  unlockedItems: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

interface SeasonalEventsProps {
  events: Event[];
}

function SeasonalEventsContent({ events }: SeasonalEventsProps) {
  const fetcher = useFetcher();

  const handleUnlockItem = (eventId: string, itemId: string) => {
    fetcher.submit(
      { 
        intent: "unlockItem",
        eventId,
        itemId 
      },
      { method: "POST" }
    );
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Seasonal Events</h3>
      {events.map(event => (
        <div key={event.id} className="mb-4 p-4 border rounded-lg">
          <h4 className="font-semibold text-lg">{event.name}</h4>
          <p className="text-sm text-gray-600">
            Ends: {new Date(event.endDate).toLocaleDateString()}
          </p>
          
          <div className="mt-2">
            <p className="font-medium">Unlockable Items:</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {event.unlockedItems.map(item => (
                <div 
                  key={item.id}
                  className="p-2 border rounded flex justify-between items-center"
                >
                  <span>{item.name}</span>
                  <button 
                    onClick={() => handleUnlockItem(event.id, item.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Unlock
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SeasonalEvents(props: SeasonalEventsProps) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <AvatarComponentErrorBoundary
          error={error}
          resetErrorBoundary={resetErrorBoundary}
          componentName="Seasonal Events"
        />
      )}
    >
      <SeasonalEventsContent {...props} />
    </ErrorBoundary>
  );
}
