import { useFetcher } from "@remix-run/react";
import type { Quest } from "~/types";

interface DailyQuestsProps {
  quests: Quest[];
}

export function DailyQuests({ quests }: DailyQuestsProps) {
  const fetcher = useFetcher();

  const completeQuest = (questId: string) => {
    fetcher.submit(
      { 
        intent: "completeQuest",
        questId 
      },
      { method: "POST" }
    );
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Daily Quests</h3>
      <ul>
        {quests.map((quest) => (
          <li key={quest.id} className="mb-2">
            <h4 className="font-semibold">{quest.title}</h4>
            <p>{quest.description}</p>
            <p>Reward: {quest.reward} XP</p>
            {!quest.completed && (
              <button
                onClick={() => completeQuest(quest.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
