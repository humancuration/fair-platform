import { db } from "~/utils/db.server";
import type { Patent, PatentContribution } from "@prisma/client";

export async function submitPatent(data: {
  title: string;
  description: string;
  inventors: string[];
  claims: string[];
  implementations: Record<string, any>[];
  files: string[];
}) {
  return db.patent.create({
    data: {
      ...data,
      status: "pending",
      inventors: {
        create: data.inventors.map(id => ({
          userId: id,
          role: "inventor",
          sharePercentage: 100 / data.inventors.length,
        })),
      },
      claims: {
        create: data.claims.map(claim => ({
          text: claim,
          status: "pending",
        })),
      },
      implementations: {
        create: data.implementations.map(impl => ({
          ...impl,
          status: "documented",
        })),
      },
      files: {
        create: data.files.map(file => ({
          path: file,
          type: getFileType(file),
        })),
      },
    },
  });
}

export async function reviewPatent(data: {
  patentId: string;
  reviewerId: string;
  verdict: "approve" | "reject" | "revise";
  comments: string;
  suggestedChanges?: Record<string, any>;
}) {
  return db.$transaction(async (tx) => {
    // Create review
    const review = await tx.patentReview.create({
      data: {
        patentId: data.patentId,
        reviewerId: data.reviewerId,
        verdict: data.verdict,
        comments: data.comments,
        suggestedChanges: data.suggestedChanges,
      },
    });

    // Update patent status based on verdict
    if (data.verdict === "approve") {
      await tx.patent.update({
        where: { id: data.patentId },
        data: { status: "approved" },
      });

      // Distribute rewards/credits to inventors
      await distributePatentRewards(tx, data.patentId);
    }

    return review;
  });
}

async function distributePatentRewards(tx: any, patentId: string) {
  const patent = await tx.patent.findUnique({
    where: { id: patentId },
    include: { inventors: true },
  });

  for (const inventor of patent.inventors) {
    await tx.userCredits.update({
      where: { userId: inventor.userId },
      data: {
        balance: {
          increment: calculateInventorReward(inventor.sharePercentage),
        },
      },
    });
  }
}
