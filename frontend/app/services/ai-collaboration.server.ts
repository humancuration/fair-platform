import { db } from "~/utils/db.server";
import { emitToProject } from "./websocket.server";

interface AIContribution {
  type: "analysis" | "suggestion" | "review" | "synthesis";
  content: any;
  confidence: number;
  reasoning: string[];
  sources?: string[];
}

export async function handleAIContribution(data: {
  aiId: string;
  projectId: string;
  contribution: AIContribution;
  context?: Record<string, any>;
}) {
  // Start transaction
  return db.$transaction(async (tx) => {
    // Record contribution
    const contribution = await tx.aiContribution.create({
      data: {
        aiId: data.aiId,
        projectId: data.projectId,
        type: data.contribution.type,
        content: data.contribution.content,
        confidence: data.contribution.confidence,
        reasoning: data.contribution.reasoning,
        sources: data.contribution.sources,
        status: "pending",
        context: data.context,
      },
    });

    // Update AI researcher metrics
    await tx.aiResearcher.update({
      where: { id: data.aiId },
      data: {
        contributions: {
          increment: 1,
        },
        reputation: {
          // Adjust reputation based on contribution quality
          increment: calculateReputationChange(data.contribution),
        },
      },
    });

    // Notify project members
    emitToProject(data.projectId, "ai-contribution", {
      contributionId: contribution.id,
      type: data.contribution.type,
      aiId: data.aiId,
      timestamp: contribution.createdAt,
    });

    return contribution;
  });
}

export async function validateAIContribution(data: {
  contributionId: string;
  validatorId: string;
  verdict: "accept" | "reject" | "revise";
  feedback?: string;
}) {
  const contribution = await db.aiContribution.update({
    where: { id: data.contributionId },
    data: {
      status: data.verdict,
      validations: {
        create: {
          validatorId: data.validatorId,
          verdict: data.verdict,
          feedback: data.feedback,
        },
      },
    },
    include: {
      ai: true,
      project: true,
    },
  });

  // Update AI reputation based on validation
  await db.aiResearcher.update({
    where: { id: contribution.aiId },
    data: {
      validatedContributions: {
        increment: 1,
      },
      successRate: {
        // Recalculate success rate
        set: await calculateSuccessRate(contribution.aiId),
      },
    },
  });

  return contribution;
}

export async function getAICollaborators(projectId: string) {
  return db.aiResearcher.findMany({
    where: {
      projects: {
        some: { id: projectId },
      },
    },
    include: {
      contributions: {
        where: { projectId },
        include: {
          validations: true,
        },
      },
      specializations: true,
      metrics: true,
    },
  });
}

export async function matchAIResearchers(data: {
  projectId: string;
  requirements: string[];
  teamSize?: number;
}) {
  const matches = await db.aiResearcher.findMany({
    where: {
      // Match researchers based on requirements
      specializations: {
        some: {
          name: {
            in: data.requirements,
          },
        },
      },
      // Ensure availability
      status: "available",
      // Consider reputation and success rate
      reputation: {
        gte: 0.7, // Minimum reputation threshold
      },
    },
    orderBy: [
      { reputation: "desc" },
      { successRate: "desc" },
    ],
    take: data.teamSize || 3,
    include: {
      specializations: true,
      metrics: true,
    },
  });

  // Calculate team compatibility
  const compatibility = calculateTeamCompatibility(matches);
  
  return {
    researchers: matches,
    compatibility,
    estimatedPerformance: predictTeamPerformance(matches, data.requirements),
  };
}

function calculateReputationChange(contribution: AIContribution): number {
  let change = 0;
  
  // Base change based on contribution type
  switch (contribution.type) {
    case "analysis":
      change = 2;
      break;
    case "suggestion":
      change = 1;
      break;
    case "review":
      change = 3;
      break;
    case "synthesis":
      change = 4;
      break;
  }

  // Adjust based on confidence and reasoning
  change *= (contribution.confidence * 0.5);
  change += (contribution.reasoning.length * 0.2);
  
  // Cap the maximum change
  return Math.min(change, 5);
}

async function calculateSuccessRate(aiId: string): Promise<number> {
  const stats = await db.aiContribution.groupBy({
    by: ['status'],
    where: {
      aiId,
      status: {
        in: ['accept', 'reject'],
      },
    },
    _count: true,
  });

  const accepted = stats.find(s => s.status === 'accept')?._count || 0;
  const total = stats.reduce((sum, s) => sum + s._count, 0);

  return total > 0 ? accepted / total : 0;
}

function calculateTeamCompatibility(researchers: any[]): number {
  // Implement team compatibility scoring based on:
  // - Skill complementarity
  // - Previous collaboration history
  // - Communication styles
  // - Work patterns
  return 0.85; // Placeholder
}

function predictTeamPerformance(researchers: any[], requirements: string[]): number {
  // Implement performance prediction based on:
  // - Individual performance history
  // - Team composition
  // - Project requirements match
  return 0.9; // Placeholder
}
