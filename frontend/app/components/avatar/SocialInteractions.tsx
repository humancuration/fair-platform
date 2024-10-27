import { useFetcher } from "@remix-run/react";
import { ErrorBoundary } from "react-error-boundary";
import { AvatarComponentErrorBoundary } from "./shared/AvatarComponentErrorBoundary";

interface Friend {
  id: string;
  username: string;
  avatarImage: string;
  lastGiftSent?: string;
}

interface SocialInteractionsProps {
  friends: Friend[];
}

function SocialInteractionsContent({ friends }: SocialInteractionsProps) {
  const fetcher = useFetcher();

  const handleSendGift = (friendId: string) => {
    fetcher.submit(
      { 
        intent: "sendGift",
        friendId 
      },
      { method: "POST" }
    );
  };

  const canSendGift = (lastGiftSent?: string) => {
    if (!lastGiftSent) return true;
    const lastGift = new Date(lastGiftSent);
    const now = new Date();
    return now.getTime() - lastGift.getTime() > 24 * 60 * 60 * 1000; // 24 hours
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Friends</h3>
      <div className="grid grid-cols-2 gap-3 mt-2">
        {friends.map((friend) => (
          <div 
            key={friend.id} 
            className="border rounded-lg p-3 flex flex-col items-center"
          >
            <img 
              src={friend.avatarImage} 
              alt={friend.username} 
              className="w-16 h-16 rounded-full object-cover"
            />
            <p className="mt-2 font-medium">{friend.username}</p>
            <button
              onClick={() => handleSendGift(friend.id)}
              disabled={!canSendGift(friend.lastGiftSent)}
              className={`mt-2 px-3 py-1 rounded text-white w-full transition-colors ${
                canSendGift(friend.lastGiftSent)
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {canSendGift(friend.lastGiftSent) ? 'Send Gift' : 'Gift Sent'}
            </button>
          </div>
        ))}
      </div>
      {friends.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No friends yet. Add some friends to interact with them!
        </p>
      )}
    </div>
  );
}

export function SocialInteractions(props: SocialInteractionsProps) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <AvatarComponentErrorBoundary
          error={error}
          resetErrorBoundary={resetErrorBoundary}
          componentName="Social Interactions"
        />
      )}
      onReset={() => {
        // Optionally refresh friend data
        window.location.reload();
      }}
    >
      <SocialInteractionsContent {...props} />
    </ErrorBoundary>
  );
}
