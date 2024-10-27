import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion } from 'framer-motion';
import { FaTrophy, FaClock, FaUsers } from 'react-icons/fa';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  participants: number;
  deadline: string;
  rewards: {
    points: number;
    badges: string[];
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const difficulty = url.searchParams.get("difficulty") || "all";
  
  // Replace with your actual data fetching logic
  const challenges = await db.challenge.findMany({
    where: difficulty !== "all" ? { difficulty } : undefined
  });

  return json({ challenges });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const challengeId = formData.get("challengeId");

  if (typeof challengeId !== "string") {
    return json({ error: "Invalid challenge ID" }, { status: 400 });
  }

  // Replace with your join challenge logic
  await db.challenge.update({
    where: { id: challengeId },
    data: { participants: { increment: 1 } }
  });

  return json({ success: true });
}

export default function AIChallenge() {
  const { challenges } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">AI Challenges</h1>
        <div className="flex gap-4">
          <fetcher.Form>
            <select
              name="difficulty"
              onChange={e => fetcher.submit(e.target.form)}
              className="p-2 border rounded"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </fetcher.Form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            whileHover={{ y: -5 }}
            className="border rounded-lg p-6 bg-white shadow-lg"
          >
            {/* Challenge card content remains mostly the same */}
            <fetcher.Form method="post">
              <input type="hidden" name="challengeId" value={challenge.id} />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Join Challenge
              </button>
            </fetcher.Form>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
