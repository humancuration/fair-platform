import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { CreateCampaignForm } from "~/components/campaign/CreateCampaignForm";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const goal = Number(formData.get("goal"));
  const deadline = new Date(formData.get("deadline") as string);
  const category = formData.get("category");
  const image = formData.get("image");

  const campaign = await prisma.campaign.create({
    data: {
      title: title as string,
      description: description as string,
      goal,
      deadline,
      category: category as string,
      image: image as string,
      creatorId: userId,
    },
  });

  return redirect(`/campaigns/${campaign.id}`);
}

export default function NewCampaignPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Campaign</h1>
      <div className="max-w-2xl mx-auto">
        <CreateCampaignForm />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-50 text-red-900 rounded-lg">
      <h1 className="text-lg font-bold">Error</h1>
      <p>Failed to create campaign. Please try again later.</p>
    </div>
  );
}
