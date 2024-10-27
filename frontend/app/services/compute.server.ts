import { db } from "~/utils/db.server";
import type { ComputeResource, ComputeJob } from "@prisma/client";

export async function allocateCompute(data: {
  projectId: string;
  resourceType: string;
  requirements: Record<string, any>;
  duration: number;
}) {
  // Find available compute resources
  const resources = await db.computeResource.findMany({
    where: {
      type: data.resourceType,
      availability: {
        path: ["status"],
        equals: "available",
      },
    },
  });

  // Allocate resources
  const allocation = await db.computeJob.create({
    data: {
      projectId: data.projectId,
      resources: {
        connect: resources.map(r => ({ id: r.id })),
      },
      requirements: data.requirements,
      duration: data.duration,
      status: "scheduled",
    },
  });

  return allocation;
}

export async function monitorComputeJob(jobId: string) {
  return db.computeJob.findUnique({
    where: { id: jobId },
    include: {
      resources: true,
      metrics: true,
    },
  });
}
