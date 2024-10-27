import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import { prisma } from "~/utils/db.server";
import { ChallengeCard } from "~/components/community/ChallengeCard";
import { LoadingVibes } from "~/components/community/LoadingVibes";
import { AchievementUnlock } from "~/components/community/AchievementUnlock";
import { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  
  const challenges = await prisma.challenge.findMany({
    where: {
      OR: [
        { userId },
        { isPublic: true }
      ],
      endDate: {
        gte: new Date()
      }
    },
    include: {
      participants: {
        where: { userId },
        select: { progress: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return json({ challenges });
}

export default function ChallengesRoute() {
  const { challenges } = useLoaderData<typeof loader>();
  const [showAchievement, setShowAchievement] = useState(false);
  const [completedChallenge, setCompletedChallenge] = useState<any>(null);

  const handleComplete = (challenge: any) => {
    setCompletedChallenge(challenge);
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 5000);
  };

  if (!challenges) {
    return <LoadingVibes />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
        Community Challenges ✨
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={{
              ...challenge,
              progress: challenge.participants[0]?.progress || 0
            }}
            onComplete={() => handleComplete(challenge)}
          />
        ))}
      </div>

      {showAchievement && completedChallenge && (
        <AchievementUnlock
          achievement={{
            id: completedChallenge.id,
            title: completedChallenge.title,
            description: "Challenge completed! 🎉",
            icon: "🏆",
            rarity: "epic"
          }}
          onClose={() => setShowAchievement(false)}
        />
      )}
    </div>
  );
}
