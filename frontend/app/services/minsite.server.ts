import { prisma } from "~/utils/db.server";
import type { User } from "@prisma/client";
import type { Json } from "~/types/minsite";

export type Minsite = {
  id: string;
  title: string;
  content: Json;
  template: string;
  customCSS?: string;
  seoMetadata?: Json;
  components: Json;
  settings?: Json;
  userId: string;
  publishedUrl?: string;
  publishedSlug?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  versions?: Array<{
    id: string;
    content: Json;
    title: string;
    createdAt: Date;
  }>;
};

export async function getMinsiteById(id: string) {
  const minsite = await prisma.minsite.findUnique({
    where: { id },
    include: {
      versions: true,
      uploads: true,
      affiliateLinks: true,
      analytics: {
        orderBy: { date: 'desc' },
        take: 30
      }
    },
  });

  if (!minsite) return null;
  return minsite;
}

export async function createMinsite({
  title,
  content,
  template,
  customCSS,
  seoMetadata,
  components,
  settings,
  userId,
}: {
  title: string;
  content: Json;
  template: string;
  customCSS?: string;
  seoMetadata?: Json;
  components: Json;
  settings?: Json;
  userId: User["id"];
}) {
  return prisma.minsite.create({
    data: {
      title,
      content,
      template,
      customCSS,
      seoMetadata,
      components,
      settings,
      user: {
        connect: { id: userId },
      },
    },
  });
}

export async function updateMinsite(
  id: string,
  data: Partial<{
    title: string;
    content: Json;
    template: string;
    customCSS?: string;
    seoMetadata?: Json;
    components: Json;
    settings?: Json;
  }>
) {
  // Create a version before updating
  const currentVersion = await prisma.minsite.findUnique({
    where: { id },
    select: { content: true, title: true, template: true, customCSS: true }
  });

  if (currentVersion) {
    await prisma.minsiteVersion.create({
      data: {
        minsiteId: id,
        content: currentVersion.content,
        title: currentVersion.title,
        template: currentVersion.template,
        customCSS: currentVersion.customCSS
      }
    });
  }

  return prisma.minsite.update({
    where: { id },
    data,
    include: {
      versions: true,
      uploads: true,
      affiliateLinks: true,
      analytics: {
        orderBy: { date: 'desc' },
        take: 1
      }
    }
  });
}

export async function publishMinsite(id: string) {
  return prisma.minsite.update({
    where: { id },
    data: {
      isPublished: true,
      publishedSlug: `${id}-${Date.now()}`,
    },
  });
}

export async function trackMinsiteAnalytics(id: string, data: {
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
        minsiteId: id,
        date: today
      }
    },
    create: {
      minsiteId: id,
      date: today,
      views: data.views ?? 1,
      visitors: data.visitors ?? 1,
      conversions: data.conversions ?? 0,
      revenue: data.revenue ?? 0,
      data: data.additionalData
    },
    update: {
      views: { increment: data.views ?? 1 },
      visitors: { increment: data.visitors ?? 1 },
      conversions: { increment: data.conversions ?? 0 },
      revenue: { increment: data.revenue ?? 0 },
      data: data.additionalData
    }
  });
}
