import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CampaignDetail } from "~/components/campaign/CampaignDetail";
import { requireUserId } from "~/utils/session.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { campaignId } = params;

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      donations: {
        include: {
          donor: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!campaign) {
    throw new Response("Campaign not found", { status: 404 });
  }

  return json({ campaign });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "donate":
      const amount = Number(formData.get("amount"));
      await prisma.donation.create({
        data: {
          amount,
          campaignId: params.campaignId!,
          donorId: userId,
        },
      });
      return json({ success: true });

    case "delete":
      const campaign = await prisma.campaign.findUnique({
        where: { id: params.campaignId },
        select: { creatorId: true },
      });

      if (campaign?.creatorId !== userId) {
        throw new Response("Not authorized", { status: 403 });
      }

      await prisma.campaign.delete({
        where: { id: params.campaignId },
      });
      return redirect("/campaigns");

    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
}

export default function CampaignDetailPage() {
  const { campaign } = useLoaderData<typeof loader>();
  return <CampaignDetail campaign={campaign} />;
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-50 text-red-900 rounded-lg">
      <h1 className="text-lg font-bold">Error</h1>
      <p>Unable to load campaign details. Please try again later.</p>
    </div>
  );
}
