import { db } from "~/utils/db.server";
import type { AIResearchTool } from "~/types/science";

export async function getResearchTools() {
  return db.researchTool.findMany({
    include: {
      capabilities: true,
      ethics: true,
    },
  });
}

export async function createResearchSession(data: {
  toolId: string;
  userId: string;
  config: Record<string, any>;
}) {
  return db.researchSession.create({
    data: {
      toolId: data.toolId,
      userId: data.userId,
      config: data.config,
      status: "active",
    },
  });
}

// Add other research-related services...
