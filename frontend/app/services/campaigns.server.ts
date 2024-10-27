import { prisma } from "~/db.server";
import type { Campaign } from "~/types/campaign";

export async function getCampaigns(searchTerm?: string, category?: string) {
  return prisma.campaign.findMany({
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
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getCampaign(id: string) {
  return prisma.campaign.findUnique({
    where: { id },
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
}

export async function createCampaign(data: {
  title: string;
  description: string;
  goal: number;
  deadline: Date;
  category: string;
  image?: string;
  createdById: number;
}) {
  return prisma.campaign.create({
    data: {
      ...data,
      status: 'ACTIVE',
      amountRaised: 0,
    },
  });
}

export async function createDonation(data: {
  amount: number;
  campaignId: string;
  donorId: number;
  message?: string;
  isAnonymous?: boolean;
}) {
  return prisma.$transaction(async (tx) => {
    const donation = await tx.donation.create({
      data,
    });

    await tx.campaign.update({
      where: { id: data.campaignId },
      data: {
        amountRaised: {
          increment: data.amount,
        },
      },
    });

    return donation;
  });
}
