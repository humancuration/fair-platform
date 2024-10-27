import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import { prisma } from "~/utils/db.server";
import { CommunityContributions } from "~/components/community/CommunityContributions";
import type { CommunityStats, Contribution } from "~/types/community";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const timeframe = url.searchParams.get("timeframe") || "month";

  const [stats, contributions] = await Promise.all([
    prisma.communityStats.findFirst({
      where: { timeframe },
      orderBy: { createdAt: "desc" }
    }),
    prisma.contribution.findMany({
      where: {
        createdAt: {
          gte: getTimeframeDate(timeframe)
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    })
  ]);

  return json({ stats, contributions });
}

function getTimeframeDate(timeframe: string): Date {
  const date = new Date();
  switch (timeframe) {
    case "week":
      date.setDate(date.getDate() - 7);
      break;
    case "month":
      date.setMonth(date.getMonth() - 1);
      break;
    case "year":
      date.setFullYear(date.getFullYear() - 1);
      break;
  }
  return date;
}

export default function CommunityRoute() {
  const { stats, contributions } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <CommunityContributions 
        stats={stats} 
        contributions={contributions} 
      />
    </div>
  );
}
