import { prisma } from '~/utils/db.server';
import type { SupportArticle, SupportChannel } from '~/types';

export async function getSupportChannels(): Promise<SupportChannel[]> {
  return prisma.supportChannel.findMany({
    where: { status: 'active' },
    orderBy: { priority: 'asc' },
  });
}

export async function getPopularArticles(): Promise<SupportArticle[]> {
  return prisma.supportArticle.findMany({
    where: { published: true },
    orderBy: { viewCount: 'desc' },
    take: 10,
  });
}

export async function handleSupportTicket(formData: FormData) {
  const type = formData.get('type');
  const subject = formData.get('subject');
  const message = formData.get('message');
  const priority = formData.get('priority');

  return prisma.supportTicket.create({
    data: {
      type: type as string,
      subject: subject as string,
      message: message as string,
      priority: priority as string,
      status: 'open',
    },
  });
}

export async function handleChatMessage(formData: FormData) {
  const message = formData.get('message');
  const sessionId = formData.get('sessionId');

  return prisma.chatMessage.create({
    data: {
      content: message as string,
      sessionId: sessionId as string,
      type: 'user',
    },
  });
}
