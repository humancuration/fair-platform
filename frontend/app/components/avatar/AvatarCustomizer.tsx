import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import type { Avatar, Inventory } from "~/types";
import { AvatarDisplay } from "./AvatarDisplay";
import { AvatarStats } from "./AvatarStats";
import { ItemSelector } from "./ItemSelector";
import { MoodSelector } from "./MoodSelector";
import { EmotionSelector } from "./EmotionSelector";
import { BackgroundSelector } from "./BackgroundSelector";
import { ErrorBoundary } from "react-error-boundary";
import { AvatarComponentErrorBoundary } from "./shared/AvatarComponentErrorBoundary";

interface AvatarCustomizerProps {
  avatar: Avatar;
  inventory: Inventory;
  // Add new props
  communityContributions: {
    sharedAssets: number;
    mentorshipHours: number;
    resourcesDonated: number;
  };
  collaborativeProjects: {
    active: number;
    completed: number;
    impact: string[];
  };
}

function AvatarCustomizerContent({ avatar, inventory }: AvatarCustomizerProps) {
  const fetcher = useFetcher();

  const handleItemSelect = (itemId: string, itemType: string) => {
    fetcher.submit(
      { 
        intent: "updateAvatar",
        itemId,
        itemType 
      },
      { method: "POST" }
    );
  };

  const handleMoodChange = (mood: string) => {
    fetcher.submit(
      { 
        intent: "updateAvatar",
        mood 
      },
      { method: "POST" }
    );
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4">
        <AvatarDisplay avatar={avatar} />
        <AvatarStats xp={avatar.xp} level={avatar.level} />
      </div>
      <div className="w-full md:w-1/2 p-4">
        <ItemSelector 
          inventory={inventory} 
          onItemSelect={handleItemSelect} 
        />
        <MoodSelector 
          currentMood={avatar.mood} 
          onMoodChange={handleMoodChange} 
        />
        <EmotionSelector 
          currentEmotion={avatar.emotion}
          currentIntensity={avatar.emotionIntensity}
          onEmotionChange={(emotion, intensity) => {
            fetcher.submit(
              { 
                intent: "updateAvatar",
                emotion,
                intensity: intensity.toString()
              },
              { method: "POST" }
            );
          }}
        />
        <BackgroundSelector 
          currentBackground={avatar.background ?? ""}
          onBackgroundChange={(backgroundId) => {
            fetcher.submit(
              { 
                intent: "updateAvatar",
                backgroundId 
              },
              { method: "POST" }
            );
          }}
        />
      </div>
    </div>
  );
}

export function AvatarCustomizer(props: AvatarCustomizerProps) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <AvatarComponentErrorBoundary
          error={error}
          resetErrorBoundary={resetErrorBoundary}
          componentName="Avatar Customizer"
        />
      )}
    >
      <AvatarCustomizerContent {...props} />
    </ErrorBoundary>
  );
}
