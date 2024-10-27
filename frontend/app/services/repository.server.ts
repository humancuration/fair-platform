import { prisma } from "~/db.server";
import type { Repository, RepositoryCreateInput, RepositoryUpdateInput } from "~/types/version-control/repository";
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);
const CACHE_TTL = 3600; // 1 hour

export async function getRepositories() {
  // Try cache first
  const cached = await redis.get('repositories:all');
  if (cached) {
    return JSON.parse(cached) as Repository[];
  }

  const repositories = await prisma.repository.findMany({
    include: {
      owner: {
        select: {
          username: true,
          email: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  await redis.setex('repositories:all', CACHE_TTL, JSON.stringify(repositories));
  return repositories;
}

export async function getRepository(id: string) {
  // Try cache first
  const cached = await redis.get(`repository:${id}`);
  if (cached) {
    return JSON.parse(cached) as Repository;
  }

  const repository = await prisma.repository.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });

  if (repository) {
    await redis.setex(`repository:${id}`, CACHE_TTL, JSON.stringify(repository));
  }

  return repository;
}

export async function createRepository(data: RepositoryCreateInput, ownerId: number) {
  const repository = await prisma.repository.create({
    data: {
      ...data,
      ownerId,
    },
    include: {
      owner: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });

  // Invalidate caches
  await redis.del('repositories:all');
  
  return repository;
}

export async function updateRepository(id: string, data: RepositoryUpdateInput) {
  const repository = await prisma.repository.update({
    where: { id },
    data,
    include: {
      owner: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });

  // Invalidate caches
  await redis.del('repositories:all');
  await redis.del(`repository:${id}`);

  return repository;
}

export async function deleteRepository(id: string) {
  await prisma.repository.delete({
    where: { id },
  });

  // Invalidate caches
  await redis.del('repositories:all');
  await redis.del(`repository:${id}`);
}
