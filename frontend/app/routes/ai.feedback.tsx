import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { motion } from 'framer-motion';
import { prisma } from "~/db.server";

interface Recommendation {
  id: string;
  name: string;
  commissionRate: number;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const profile = formData.get("profile");

  if (typeof profile !== "string") {
    return json({ error: "Invalid profile data" }, { status: 400 });
  }

  try {
    const recommendations = await prisma.recommendation.findMany({
      where: {
        // Add your recommendation filtering logic here
        // This is just an example
        targetAudience: {
          contains: profile,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        commissionRate: true
      }
    });

    return json({ recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return json({ error: "Failed to load recommendations" }, { status: 500 });
  }
}

export default function AIFeedback() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI-Powered Affiliate Recommendations</h1>
      
      <Form method="post" className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Describe Your Content and Audience
        </label>
        <textarea
          name="profile"
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="e.g., I create travel vlogs targeting millennials interested in sustainable tourism..."
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Get Recommendations
        </button>
      </Form>

      {actionData?.error && (
        <div className="text-red-500 mt-2">{actionData.error}</div>
      )}

      {actionData?.recommendations?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold mb-2">
            Recommended Affiliate Programs
          </h2>
          <ul className="space-y-2">
            {actionData.recommendations.map((program: Recommendation) => (
              <motion.li
                key={program.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-white rounded-lg shadow"
              >
                <strong>{program.name}</strong>
                <span className="ml-2 text-green-600">
                  {program.commissionRate}% Commission
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
