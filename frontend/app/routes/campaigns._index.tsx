import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { prisma } from "~/db.server";
import { CampaignList } from "~/components/campaign/CampaignList";
import { SearchBar } from "~/components/campaign/SearchBar";
import { LoadingSpinner } from "~/components/common/LoadingSpinner";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category");

  const campaigns = await prisma.campaign.findMany({
    where: {
      ...(searchTerm && {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category }),
    },
    include: {
      createdBy: {
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
    orderBy: {
      createdAt: 'desc',
    },
  });

  return json({ campaigns });
}

export default function CampaignsPage() {
  const { campaigns } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (term: string) => {
    setSearchParams(prev => {
      if (term) {
        prev.set("search", term);
      } else {
        prev.delete("search");
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-semibold mb-6">All Campaigns</h1>
      <SearchBar 
        defaultValue={searchParams.get("search") || ""}
        onSearch={handleSearch}
      />
      <CampaignList campaigns={campaigns} />
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-50 text-red-900 rounded-lg">
      <h1 className="text-lg font-bold">Error</h1>
      <p>Failed to load campaigns. Please try again later.</p>
    </div>
  );
}
