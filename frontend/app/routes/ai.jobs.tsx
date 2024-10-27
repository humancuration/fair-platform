import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { motion } from 'framer-motion';
import { prisma } from "~/db.server";

interface AIJob {
  id: string;
  title: string;
  description: string;
  complexity: number;
  potentialImpact: number;
  estimatedDuration: string;
  urgency: 'immediate' | 'standard' | 'flexible';
  userEstimatedDifficulty: number;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const model = url.searchParams.get("model") || "default";

  const jobs = await prisma.aiJob.findMany({
    where: {
      status: "available",
      model: model
    },
    orderBy: {
      urgency: 'desc'
    }
  });

  return json({ jobs });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "submit") {
    const title = formData.get("title");
    const description = formData.get("description");
    const urgency = formData.get("urgency");
    const difficulty = formData.get("difficulty");

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof urgency !== "string" ||
      typeof difficulty !== "string"
    ) {
      return json({ error: "Invalid form data" }, { status: 400 });
    }

    try {
      const job = await prisma.aiJob.create({
        data: {
          title,
          description,
          urgency: urgency as 'immediate' | 'standard' | 'flexible',
          userEstimatedDifficulty: parseInt(difficulty),
          status: "available"
        }
      });

      return json({ success: true, job });
    } catch (error) {
      return json({ error: "Failed to create job" }, { status: 500 });
    }
  }

  if (action === "accept") {
    const jobId = formData.get("jobId");
    const model = formData.get("model");

    if (typeof jobId !== "string" || typeof model !== "string") {
      return json({ error: "Invalid job data" }, { status: 400 });
    }

    try {
      const job = await prisma.aiJob.update({
        where: { id: jobId },
        data: { status: "in_progress" }
      });

      return json({ success: true, job });
    } catch (error) {
      return json({ error: "Failed to accept job" }, { status: 500 });
    }
  }

  return json({ error: "Invalid action" }, { status: 400 });
}

export default function AIJobs() {
  const { jobs } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">AI Job Marketplace</h2>
      
      <Form method="get" className="mb-4">
        <label htmlFor="model-select" className="block mb-2">
          Select AI Model:
        </label>
        <select
          id="model-select"
          name="model"
          className="w-full p-2 border rounded"
        >
          <option value="default">Default Model</option>
          <option value="advanced">Advanced Model (Longer processing time)</option>
        </select>
      </Form>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Submit New Job</h3>
        <Form method="post" className="space-y-4">
          <input type="hidden" name="_action" value="submit" />
          <div>
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <textarea
              name="description"
              placeholder="Job Description"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <select
              name="urgency"
              className="w-full p-2 border rounded"
              required
            >
              <option value="immediate">Immediate</option>
              <option value="standard">Standard</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div>
            <input
              type="number"
              name="difficulty"
              placeholder="Estimated Difficulty (1-10)"
              min="1"
              max="10"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Job
          </button>
        </Form>
      </div>

      <h3 className="text-xl font-semibold mb-4">Available Jobs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job: AIJob) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border p-4 rounded shadow"
          >
            <h4 className="text-lg font-semibold">{job.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{job.description}</p>
            <div className="space-y-1">
              <p>Complexity: {job.complexity}/10</p>
              <p>Potential Impact: {job.potentialImpact}/10</p>
              <p>Estimated Duration: {job.estimatedDuration}</p>
              <p>Urgency: {job.urgency}</p>
              <p>User Estimated Difficulty: {job.userEstimatedDifficulty}/10</p>
            </div>
            <Form method="post" className="mt-4">
              <input type="hidden" name="_action" value="accept" />
              <input type="hidden" name="jobId" value={job.id} />
              <button
                type="submit"
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Accept Job
              </button>
            </Form>
          </motion.div>
        ))}
      </div>

      {actionData?.error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {actionData.error}
        </div>
      )}
    </div>
  );
}
