import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const featuredCampaigns = await prisma.campaign.findMany({
    where: {
      status: 'ACTIVE',
      featured: true,
    },
    take: 6,
    orderBy: {
      amountRaised: 'desc',
    },
    include: {
      createdBy: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return json({ campaigns: featuredCampaigns });
}

export default function FeaturedCampaignsPage() {
  const { campaigns } = useLoaderData<typeof loader>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {campaigns.map((campaign) => (
        <Link 
          key={campaign.id} 
          to={`/campaigns/${campaign.id}`} 
          className="block p-4 border rounded hover:bg-gray-50 transition"
        >
          <h3 className="text-xl font-semibold">{campaign.title}</h3>
          <p className="text-gray-600 mt-2">{campaign.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {campaign.createdBy.avatar && (
                <img 
                  src={campaign.createdBy.avatar} 
                  alt={campaign.createdBy.username}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="text-sm text-gray-500">
                {campaign.createdBy.username}
              </span>
            </div>
            <div className="text-sm text-blue-500">Learn more →</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-50 text-red-900 rounded-lg">
      <h1 className="text-lg font-bold">Error</h1>
      <p>Failed to load featured campaigns. Please try again later.</p>
    </div>
  );
}
