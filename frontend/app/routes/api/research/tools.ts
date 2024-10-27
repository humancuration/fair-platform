import { json, ActionFunction } from "@remix-run/node";
import { createResearchSession } from "~/services/research.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const toolId = formData.get("toolId");
  const config = JSON.parse(formData.get("config") as string);

  if (!toolId) {
    return json({ error: "Tool ID is required" }, { status: 400 });
  }

  const session = await createResearchSession({
    toolId: toolId as string,
    userId: "current-user", // Get from auth
    config,
  });

  return json({ session });
};
