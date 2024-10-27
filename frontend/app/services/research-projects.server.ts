import { db } from "~/utils/db.server";
import type { ResearchProject } from "@prisma/client";

export async function createResearchProject(data: {
  title: string;
  description: string;
  type: string;
  stage: string;
  resources: Record<string, any>;
  team: string[];
}) {
  return db.researchProject.create({
    data: {
      ...data,
      team: {
        connect: data.team.map(id => ({ id })),
      },
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function getResearchProjects(filters?: {
  type?: string;
  stage?: string;
  team?: string[];
}) {
  return db.researchProject.findMany({
    where: {
      type: filters?.type,
      stage: filters?.stage,
      team: {
        some: {
          id: {
            in: filters?.team,
          },
        },
      },
    },
    include: {
      team: true,
      resources: true,
      outputs: true,
      milestones: true,
    },
  });
}

export async function updateResearchProject(id: string, data: Partial<ResearchProject>) {
  return db.researchProject.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}
