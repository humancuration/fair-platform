import { json, ActionFunction } from "@remix-run/node";
import { 
  handleCollaborationEvent,
  startCollaborationSession 
} from "~/services/realtime.server";
import { requireUser } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "start-session": {
      const session = await startCollaborationSession({
        projectId: formData.get("projectId") as string,
        userId: user.id,
      });
      return json({ session });
    }

    case "collaboration-event": {
      const event = await handleCollaborationEvent({
        type: formData.get("type") as any,
        projectId: formData.get("projectId") as string,
        userId: user.id,
        content: JSON.parse(formData.get("content") as string),
      });
      return json({ event });
    }

    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
};
