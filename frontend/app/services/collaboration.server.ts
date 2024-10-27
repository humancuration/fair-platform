import { db } from "~/utils/db.server";
import type { CollaborationSession } from "~/types/science";

export async function createCollaborationSession(data: {
  projectId: string;
  participants: string[];
  type: string;
}) {
  return db.collaborationSession.create({
    data: {
      projectId: data.projectId,
      participants: {
        connect: data.participants.map(id => ({ id })),
      },
      type: data.type,
      status: "active",
    },
  });
}

export async function joinSession(sessionId: string, participantId: string) {
  return db.collaborationSession.update({
    where: { id: sessionId },
    data: {
      participants: {
        connect: { id: participantId },
      },
    },
  });
}
