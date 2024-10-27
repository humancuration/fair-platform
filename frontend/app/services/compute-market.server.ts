import { db } from "~/utils/db.server";
import type { ComputeResource, ComputeJob } from "@prisma/client";

export async function listAvailableResources(filters?: {
  type?: string;
  minMemory?: number;
  maxCost?: number;
}) {
  return db.computeResource.findMany({
    where: {
      type: filters?.type,
      specs: {
        path: ["memory"],
        gte: filters?.minMemory,
      },
      pricing: {
        path: ["hourly"],
        lte: filters?.maxCost,
      },
      status: "available",
    },
    include: {
      provider: true,
      metrics: true,
      reviews: true,
    },
  });
}

export async function reserveCompute(data: {
  resourceId: string;
  userId: string;
  duration: number;
  jobConfig: Record<string, any>;
}) {
  // Start transaction
  return db.$transaction(async (tx) => {
    // Check resource availability
    const resource = await tx.computeResource.findUnique({
      where: { id: data.resourceId },
    });

    if (!resource || resource.status !== "available") {
      throw new Error("Resource not available");
    }

    // Calculate cost
    const cost = calculateComputeCost(resource, data.duration);

    // Check user's credit/UBI balance
    const user = await tx.user.findUnique({
      where: { id: data.userId },
      include: { credits: true },
    });

    if (!user || user.credits.balance < cost) {
      throw new Error("Insufficient credits");
    }

    // Create reservation
    const reservation = await tx.computeJob.create({
      data: {
        resourceId: data.resourceId,
        userId: data.userId,
        duration: data.duration,
        config: data.jobConfig,
        cost,
        status: "reserved",
      },
    });

    // Update resource status
    await tx.computeResource.update({
      where: { id: data.resourceId },
      data: { status: "reserved" },
    });

    // Deduct credits
    await tx.userCredits.update({
      where: { userId: data.userId },
      data: {
        balance: {
          decrement: cost,
        },
      },
    });

    return reservation;
  });
}

function calculateComputeCost(resource: ComputeResource, duration: number): number {
  const baseRate = resource.pricing.hourly;
  const utilization = resource.metrics.currentUtilization;
  const demandMultiplier = calculateDemandMultiplier(utilization);
  return baseRate * duration * demandMultiplier;
}
