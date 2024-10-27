import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";
import { getAnalytics } from "~/utils/analytics.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const minsiteId = url.searchParams.get("minsiteId");
  const range = url.searchParams.get("range") as "day" | "week" | "month" | "year" || "week";

  if (!minsiteId) {
    return json({ error: "Missing minsiteId" }, { status: 400 });
  }

  const analytics = await getAnalytics(minsiteId, range);
  return json(analytics);
}
