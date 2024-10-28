import { LinkedContent, LinkedContentType } from '@prisma/client';

export type LinkedContentCreate = Omit<LinkedContent, 'id' | 'createdAt' | 'updatedAt'>;

export type LinkedContentUpdate = Partial<LinkedContentCreate>;

export { LinkedContent, LinkedContentType };
