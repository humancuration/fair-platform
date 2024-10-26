import { prisma } from '~/utils/db.server';

export async function getTermsOfService() {
  const terms = await prisma.legalDocument.findFirst({
    where: { type: 'terms' },
    orderBy: { version: 'desc' },
  });

  return {
    lastUpdated: terms?.updatedAt || new Date(),
    sections: terms?.content || [],
  };
}

export async function getPrivacyPolicy() {
  const privacy = await prisma.legalDocument.findFirst({
    where: { type: 'privacy' },
    orderBy: { version: 'desc' },
  });

  return {
    lastUpdated: privacy?.updatedAt || new Date(),
    sections: privacy?.content || [],
  };
}

export async function getFAQs() {
  return prisma.faq.findMany({
    orderBy: { order: 'asc' },
    where: { published: true },
  });
}
