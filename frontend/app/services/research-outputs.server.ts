import { db } from "~/utils/db.server";

export async function createResearchOutput(data: {
  projectId: string;
  type: string;
  title: string;
  description: string;
  content: Record<string, any>;
  contributors: string[];
}) {
  return db.researchOutput.create({
    data: {
      ...data,
      contributors: {
        connect: data.contributors.map(id => ({ id })),
      },
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function getResearchOutputs(filters?: {
  projectId?: string;
  type?: string;
  contributors?: string[];
}) {
  return db.researchOutput.findMany({
    where: {
      projectId: filters?.projectId,
      type: filters?.type,
      contributors: {
        some: {
          id: {
            in: filters?.contributors,
          },
        },
      },
    },
    include: {
      contributors: true,
      reviews: true,
      citations: true,
    },
  });
}
