import { json, ActionFunction, LoaderFunction } from "@remix-run/node";
import { 
  listAvailableResources,
  reserveCompute 
} from "~/services/compute-market.server";
import { requireUser } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const minMemory = url.searchParams.get("minMemory");
  const maxCost = url.searchParams.get("maxCost");

  const resources = await listAvailableResources({
    type: type || undefined,
    minMemory: minMemory ? parseInt(minMemory) : undefined,
    maxCost: maxCost ? parseFloat(maxCost) : undefined,
  });

  return json({ resources });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "reserve": {
      const reservation = await reserveCompute({
        resourceId: formData.get("resourceId") as string,
        userId: user.id,
        duration: parseInt(formData.get("duration") as string),
        jobConfig: JSON.parse(formData.get("config") as string),
      });
      return json({ reservation });
    }

    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
};
