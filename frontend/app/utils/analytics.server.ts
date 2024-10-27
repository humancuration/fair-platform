import { prisma } from "~/utils/db.server";
import type { Json } from "~/types/models";

export async function trackEvent(minsiteId: string, data: {
  views?: number;
  visitors?: number;
  conversions?: number;
  revenue?: number;
  additionalData?: Json;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.analytics.upsert({
    where: {
      minsiteId_date: {
        minsiteId,
        date: today
      }
    },
    create: {
      minsiteId,
      date: today,
      views: data.views ?? 0,
      visitors: data.visitors ?? 0,
      conversions: data.conversions ?? 0,
      revenue: data.revenue ?? 0,
      data: data.additionalData
    },
    update: {
      views: { increment: data.views ?? 0 },
      visitors: { increment: data.visitors ?? 0 },
      conversions: { increment: data.conversions ?? 0 },
      revenue: { increment: data.revenue ?? 0 },
      data: data.additionalData
    }
  });
}

export async function getAnalytics(minsiteId: string, range: "day" | "week" | "month" | "year") {
  const now = new Date();
  const start = new Date();

  switch (range) {
    case "day":
      start.setDate(start.getDate() - 1);
      break;
    case "week":
      start.setDate(start.getDate() - 7);
      break;
    case "month":
      start.setMonth(start.getMonth() - 1);
      break;
    case "year":
      start.setFullYear(start.getFullYear() - 1);
      break;
  }

  const analytics = await prisma.analytics.findMany({
    where: {
      minsiteId,
      date: {
        gte: start,
        lte: now
      }
    },
    orderBy: { date: "asc" }
  });

  return {
    labels: analytics.map(a => a.date.toLocaleDateString()),
    views: analytics.map(a => a.views),
    conversions: analytics.map(a => a.conversions),
    revenue: analytics.map(a => a.revenue),
    totals: {
      views: analytics.reduce((sum, a) => sum + a.views, 0),
      conversions: analytics.reduce((sum, a) => sum + a.conversions, 0),
      revenue: analytics.reduce((sum, a) => sum + a.revenue, 0),
    }
  };
}
