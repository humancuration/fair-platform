import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { ErrorBoundary } from "react-error-boundary";
import { AvatarComponentErrorBoundary } from "./shared/AvatarComponentErrorBoundary";

interface Background {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

interface BackgroundSelectorProps {
  currentBackground: string;
  onBackgroundChange: (backgroundId: string) => void;
}

function BackgroundSelectorContent({ 
  currentBackground, 
  onBackgroundChange 
}: BackgroundSelectorProps) {
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>([]);
  const fetcher = useFetcher();

  useEffect(() => {
    // Load backgrounds data
    fetcher.load("/api/marketplace/backgrounds");
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setBackgrounds(fetcher.data.backgrounds || []);
      setOwnedBackgrounds(fetcher.data.ownedBackgrounds || []);
    }
  }, [fetcher.data]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Avatar Background</h3>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {backgrounds.map((background) => (
          <div 
            key={background.id} 
            className={`cursor-pointer border p-2 rounded ${
              currentBackground === background.id ? 'border-blue-500' : ''
            }`}
          >
            <img 
              src={background.imageUrl} 
              alt={background.name} 
              className="w-full h-auto" 
            />
            <p className="text-center mt-1">{background.name}</p>
            {ownedBackgrounds.includes(background.id) ? (
              <button
                onClick={() => onBackgroundChange(background.id)}
                className="w-full mt-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Select
              </button>
            ) : (
              <Link
                to={`/marketplace/product/${background.id}`}
                className="block w-full mt-2 px-2 py-1 bg-blue-500 text-white rounded text-center hover:bg-blue-600 transition-colors"
              >
                Buy (${background.price})
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BackgroundSelector(props: BackgroundSelectorProps) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <AvatarComponentErrorBoundary
          error={error}
          resetErrorBoundary={resetErrorBoundary}
          componentName="Background Selector"
        />
      )}
      onReset={() => {
        // Clear any cached background data
        localStorage.removeItem('backgroundSelectorCache');
      }}
    >
      <BackgroundSelectorContent {...props} />
    </ErrorBoundary>
  );
}
