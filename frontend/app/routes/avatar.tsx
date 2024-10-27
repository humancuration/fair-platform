import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { getUserId } from "~/services/auth.server";
import { AvatarCustomizer } from "~/components/avatar/AvatarCustomizer";
import { SeasonalEvents } from "~/components/avatar/SeasonalEvents";
import { DailyQuests } from "~/components/avatar/DailyQuests";
import { SocialInteractions } from "~/components/avatar/SocialInteractions";
import { AvatarErrorBoundary } from "~/components/avatar/AvatarErrorBoundary";
import type { AvatarLoaderData } from "~/types";
import { ErrorBoundary } from "react-error-boundary";
import { AvatarComponentErrorBoundary } from "~/components/avatar/shared/AvatarComponentErrorBoundary";

export const ErrorBoundary = AvatarErrorBoundary;

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserId(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const [avatar, inventory, events, quests, friends] = await Promise.all([
    fetch(`${process.env.API_URL}/avatar/${user.id}`).then(r => r.json()),
    fetch(`${process.env.API_URL}/inventory/${user.id}`).then(r => r.json()),
    fetch(`${process.env.API_URL}/events/current`).then(r => r.json()),
    fetch(`${process.env.API_URL}/quests/${user.id}`).then(r => r.json()),
    fetch(`${process.env.API_URL}/friends/${user.id}`).then(r => r.json())
  ]);

  return json<AvatarLoaderData>({ 
    user,
    avatar,
    inventory,
    events,
    quests,
    friends
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUserId(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "updateAvatar": {
      const itemId = formData.get("itemId");
      const itemType = formData.get("itemType");
      const mood = formData.get("mood");
      const emotion = formData.get("emotion");
      const intensity = formData.get("intensity");
      const backgroundId = formData.get("backgroundId");

      // Handle different update types
      if (itemId && itemType) {
        return json(await updateAvatarItem(user.id, itemId.toString(), itemType.toString()));
      }
      if (mood) {
        return json(await updateAvatarMood(user.id, mood.toString()));
      }
      if (emotion && intensity) {
        return json(await updateAvatarEmotion(user.id, emotion.toString(), Number(intensity)));
      }
      if (backgroundId) {
        return json(await updateAvatarBackground(user.id, backgroundId.toString()));
      }
      break;
    }
    case "completeQuest": {
      const questId = formData.get("questId");
      if (!questId) throw new Error("Quest ID is required");
      return json(await completeQuest(user.id, questId.toString()));
    }
    case "unlockItem": {
      const eventId = formData.get("eventId");
      const itemId = formData.get("itemId");
      if (!eventId || !itemId) throw new Error("Event ID and Item ID are required");
      return json(await unlockEventItem(user.id, eventId.toString(), itemId.toString()));
    }
    case "sendGift": {
      const friendId = formData.get("friendId");
      if (!friendId) throw new Error("Friend ID is required");
      return json(await sendGift(user.id, friendId.toString()));
    }
    default:
      throw new Error("Invalid intent");
  }
}

// Component
function AvatarPageContent() {
  const { user, avatar, inventory, events, quests, friends } = useLoaderData<AvatarLoaderData>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Avatar Customization</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ErrorBoundary
          FallbackComponent={({ error, resetErrorBoundary }) => (
            <AvatarComponentErrorBoundary
              error={error}
              resetErrorBoundary={resetErrorBoundary}
              componentName="Avatar Section"
            />
          )}
        >
          <div>
            <AvatarCustomizer avatar={avatar} inventory={inventory} />
          </div>
        </ErrorBoundary>

        <ErrorBoundary
          FallbackComponent={({ error, resetErrorBoundary }) => (
            <AvatarComponentErrorBoundary
              error={error}
              resetErrorBoundary={resetErrorBoundary}
              componentName="Activities Section"
            />
          )}
        >
          <div>
            <SeasonalEvents events={events} />
            <DailyQuests quests={quests} />
            <SocialInteractions friends={friends} />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default function AvatarPage() {
  return (
    <ErrorBoundary FallbackComponent={AvatarErrorBoundary}>
      <AvatarPageContent />
    </ErrorBoundary>
  );
}

// API functions (implement these based on your API)
async function updateAvatarItem(userId: string, itemId: string, itemType: string) {
  // Implementation
}

async function updateAvatarMood(userId: string, mood: string) {
  // Implementation
}

async function updateAvatarEmotion(userId: string, emotion: string, intensity: number) {
  // Implementation
}

async function updateAvatarBackground(userId: string, backgroundId: string) {
  // Implementation
}

async function completeQuest(userId: string, questId: string) {
  // Implementation
}

async function unlockEventItem(userId: string, eventId: string, itemId: string) {
  // Implementation
}

async function sendGift(userId: string, friendId: string) {
  // Implementation
}
