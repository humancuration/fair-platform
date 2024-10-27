import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { motion, AnimatePresence } from 'framer-motion';
import { FaServer, FaMemory, FaMicrochip, FaNetworkWired } from 'react-icons/fa';
import { prisma } from "~/db.server";
import { requireUser } from "~/auth.server";

interface ComputeResource {
  id: string;
  type: 'CPU' | 'GPU' | 'TPU' | 'Memory' | 'Storage' | 'Network';
  specs: {
    model?: string;
    cores?: number;
    memory?: number;
    bandwidth?: number;
    performance?: number;
  };
  utilization: number;
  cost: number;
  provider: {
    id: string;
    name: string;
    reputation: number;
    location: string;
  };
  status: 'available' | 'reserved' | 'in-use';
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  const resources = await prisma.computeResource.findMany({
    where: {
      type: type as ComputeResource['type'] || undefined,
      status: 'available',
      OR: [
        { userId: user.id },
        { public: true }
      ]
    },
    include: {
      provider: true,
      metrics: true
    }
  });

  return json({ resources });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "allocate") {
    const resourceId = formData.get("resourceId");
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const taskType = formData.get("taskType");

    if (
      typeof resourceId !== "string" ||
      typeof startTime !== "string" ||
      typeof endTime !== "string" ||
      typeof taskType !== "string"
    ) {
      return json({ error: "Invalid form data" }, { status: 400 });
    }

    try {
      const allocation = await prisma.resourceAllocation.create({
        data: {
          resourceId,
          userId: user.id,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          taskType,
          status: 'scheduled'
        }
      });

      return json({ success: true, allocation });
    } catch (error) {
      return json({ error: "Failed to allocate resource" }, { status: 500 });
    }
  }

  return json({ error: "Invalid action" }, { status: 400 });
}

export default function AIResources() {
  const { resources } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI Resource Allocation</h1>

      <Form method="get" className="mb-6">
        <select
          name="type"
          className="w-full md:w-auto px-4 py-2 border rounded-lg"
        >
          <option value="">All Resources</option>
          <option value="CPU">CPU</option>
          <option value="GPU">GPU</option>
          <option value="TPU">TPU</option>
          <option value="Memory">Memory</option>
          <option value="Storage">Storage</option>
          <option value="Network">Network</option>
        </select>
      </Form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border rounded-lg p-6 bg-white shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                {resource.type === 'CPU' && <FaMicrochip className="text-blue-500" />}
                {resource.type === 'GPU' && <FaServer className="text-green-500" />}
                {resource.type === 'Memory' && <FaMemory className="text-purple-500" />}
                {resource.type === 'Network' && <FaNetworkWired className="text-orange-500" />}
                <div>
                  <h3 className="font-semibold">{resource.type}</h3>
                  <p className="text-sm text-gray-500">{resource.specs.model}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-sm ${
                resource.status === 'available' ? 'bg-green-100 text-green-800' :
                resource.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {resource.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Utilization</span>
                <span>{resource.utilization}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${resource.utilization}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Cost</span>
                <span>${resource.cost}/hour</span>
              </div>
            </div>

            {resource.status === 'available' && (
              <Form method="post" className="space-y-4">
                <input type="hidden" name="_action" value="allocate" />
                <input type="hidden" name="resourceId" value={resource.id} />
                
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Task Type</label>
                  <select
                    name="taskType"
                    required
                    className="w-full p-2 border rounded"
                  >
                    <option value="training">Training</option>
                    <option value="inference">Inference</option>
                    <option value="data-processing">Data Processing</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Allocate Resource
                </button>
              </Form>
            )}
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
