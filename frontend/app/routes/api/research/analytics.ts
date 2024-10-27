import { json, LoaderFunction } from "@remix-run/node";
import { 
  getProjectAnalytics,
  getResearcherAnalytics 
} from "~/services/research-analytics.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId");
  const researcherId = url.searchParams.get("researcherId");

  if (projectId) {
    const analytics = await getProjectAnalytics(projectId);
    return json({ analytics });
  }

  if (researcherId) {
    const analytics = await getResearcherAnalytics(researcherId);
    return json({ analytics });
  }

  return json({ error: "Missing ID parameter" }, { status: 400 });
};
