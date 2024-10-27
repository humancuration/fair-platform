import { db } from "~/utils/db.server";
import type { AIResearcher, ResearchProject } from "@prisma/client";

export async function createAIResearcher(data: {
  name: string;
  type: string;
  capabilities: string[];
  specialization: string[];
  architecture: Record<string, any>;
  ethics: Record<string, any>;
}) {
  return db.aiResearcher.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function getAIResearchers(filters?: {
  type?: string;
  capabilities?: string[];
  specialization?: string[];
}) {
  return db.aiResearcher.findMany({
    where: {
      type: filters?.type,
      capabilities: {
        hasEvery: filters?.capabilities,
      },
      specialization: {
        hasEvery: filters?.specialization,
      },
    },
    include: {
      projects: true,
      contributions: true,
    },
  });
}

export async function updateAIResearcher(id: string, data: Partial<AIResearcher>) {
  return db.aiResearcher.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}
