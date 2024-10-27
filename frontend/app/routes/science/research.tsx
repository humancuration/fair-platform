import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AIResearchTools } from "~/components/science/collaboration/AIResearchTools";
import { getResearchTools } from "~/services/research.server";

export const loader: LoaderFunction = async ({ request }) => {
  const tools = await getResearchTools();
  return json({ tools });
};

export default function ResearchRoute() {
  const { tools } = useLoaderData<typeof loader>();
  return <AIResearchTools tools={tools} />;
}
