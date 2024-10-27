import { db } from "~/utils/db.server";

export async function getProjectAnalytics(projectId: string) {
  const project = await db.researchProject.findUnique({
    where: { id: projectId },
    include: {
      team: true,
      resources: true,
      outputs: {
        include: {
          citations: true,
          reviews: true,
        },
      },
      milestones: true,
    },
  });

  return {
    resources: {
      compute: calculateComputeUsage(project.resources),
      storage: calculateStorageUsage(project.resources),
      funding: calculateFundingMetrics(project.resources),
    },
    impact: {
      citations: calculateCitationMetrics(project.outputs),
      implementations: calculateImplementationMetrics(project.outputs),
      community: calculateCommunityMetrics(project),
    },
    progress: {
      milestones: calculateMilestoneProgress(project.milestones),
      timeline: generateProjectTimeline(project),
      risks: assessProjectRisks(project),
    },
  };
}

export async function getResearcherAnalytics(researcherId: string) {
  const researcher = await db.researcher.findUnique({
    where: { id: researcherId },
    include: {
      projects: true,
      contributions: true,
      reviews: true,
      citations: true,
    },
  });

  return {
    impact: {
      hIndex: calculateHIndex(researcher.citations),
      contributions: analyzeContributions(researcher.contributions),
      expertise: assessExpertise(researcher),
    },
    collaboration: {
      network: analyzeCollaborationNetwork(researcher),
      roles: analyzeResearchRoles(researcher),
      reputation: calculateReputation(researcher),
    },
  };
}
