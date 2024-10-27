import { json, ActionFunction } from "@remix-run/node";
import { createAIResearcher, getAIResearchers } from "~/services/ai-research.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create":
      const researcher = await createAIResearcher({
        name: formData.get("name") as string,
        type: formData.get("type") as string,
        capabilities: JSON.parse(formData.get("capabilities") as string),
        specialization: JSON.parse(formData.get("specialization") as string),
        architecture: JSON.parse(formData.get("architecture") as string),
        ethics: JSON.parse(formData.get("ethics") as string),
      });
      return json({ researcher });

    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
};
