import { db } from "~/utils/db.server";
import { emitToProject, emitToUser } from "./websocket.server";

export async function handleCollaborationEvent(data: {
  type: "edit" | "comment" | "cursor" | "selection";
  projectId: string;
  userId: string;
  content: any;
}) {
  // Store event in database
  const event = await db.collaborationEvent.create({
    data: {
      type: data.type,
      projectId: data.projectId,
      userId: data.userId,
      content: data.content,
    },
  });

  // Broadcast to other collaborators
  emitToProject(data.projectId, "collaboration-event", {
    type: data.type,
    userId: data.userId,
    content: data.content,
    timestamp: event.createdAt,
  });

  return event;
}

export async function startCollaborationSession(data: {
  projectId: string;
  userId: string;
}) {
  // Create session
  const session = await db.collaborationSession.create({
    data: {
      projectId: data.projectId,
      userId: data.userId,
      status: "active",
    },
  });

  // Load initial state
  const initialState = await db.collaborationState.findUnique({
    where: { projectId: data.projectId },
  });

  return {
    session,
    initialState,
  };
}
