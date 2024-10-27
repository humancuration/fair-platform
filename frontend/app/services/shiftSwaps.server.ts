import { prisma } from "~/db.server";
import type { ShiftSwap } from "~/types/calendar";

export async function getShiftSwaps(groupId: string): Promise<ShiftSwap[]> {
  const swaps = await prisma.shiftSwap.findMany({
    where: {
      groupId,
    },
    include: {
      requester: {
        select: {
          id: true,
          username: true,
        },
      },
      originalShift: {
        select: {
          id: true,
          date: true,
          startTime: true,
          endTime: true,
          role: true,
        },
      },
      desiredShift: {
        select: {
          id: true,
          date: true,
          startTime: true,
          endTime: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return swaps.map(swap => ({
    id: swap.id,
    requesterId: swap.requesterId,
    requesterName: swap.requester.username,
    originalShift: {
      id: swap.originalShift.id,
      date: swap.originalShift.date.toISOString(),
      startTime: swap.originalShift.startTime,
      endTime: swap.originalShift.endTime,
      role: swap.originalShift.role,
    },
    desiredShift: {
      id: swap.desiredShift.id,
      date: swap.desiredShift.date.toISOString(),
      startTime: swap.desiredShift.startTime,
      endTime: swap.desiredShift.endTime,
      role: swap.desiredShift.role,
    },
    status: swap.status,
    createdAt: swap.createdAt.toISOString(),
  }));
}

export async function approveShiftSwap(swapId: string) {
  const swap = await prisma.shiftSwap.findUnique({
    where: { id: swapId },
    include: {
      originalShift: true,
      desiredShift: true,
    },
  });

  if (!swap) {
    throw new Error('Shift swap not found');
  }

  // Start a transaction to ensure all operations succeed or fail together
  await prisma.$transaction(async (tx) => {
    // Update the swap status
    await tx.shiftSwap.update({
      where: { id: swapId },
      data: { status: 'approved' },
    });

    // Swap the assigned users between shifts
    await tx.shift.update({
      where: { id: swap.originalShift.id },
      data: { assignedUserId: swap.requesterId },
    });

    await tx.shift.update({
      where: { id: swap.desiredShift.id },
      data: { assignedUserId: swap.originalShift.assignedUserId },
    });

    // Create notifications for involved users
    await tx.notification.createMany({
      data: [
        {
          userId: swap.requesterId,
          type: 'SHIFT_SWAP_APPROVED',
          message: `Your shift swap request has been approved`,
          metadata: { swapId: swap.id },
        },
        {
          userId: swap.originalShift.assignedUserId,
          type: 'SHIFT_SWAP_APPROVED',
          message: `A shift swap involving your shift has been approved`,
          metadata: { swapId: swap.id },
        },
      ],
    });
  });
}

export async function rejectShiftSwap(swapId: string) {
  const swap = await prisma.shiftSwap.findUnique({
    where: { id: swapId },
    select: { requesterId: true },
  });

  if (!swap) {
    throw new Error('Shift swap not found');
  }

  await prisma.$transaction(async (tx) => {
    // Update the swap status
    await tx.shiftSwap.update({
      where: { id: swapId },
      data: { status: 'rejected' },
    });

    // Create notification for requester
    await tx.notification.create({
      data: {
        userId: swap.requesterId,
        type: 'SHIFT_SWAP_REJECTED',
        message: `Your shift swap request has been rejected`,
        metadata: { swapId },
      },
    });
  });
}

export async function createShiftSwap(data: {
  requesterId: string;
  groupId: string;
  originalShiftId: string;
  desiredShiftId: string;
}) {
  const { requesterId, groupId, originalShiftId, desiredShiftId } = data;

  // Verify shifts exist and belong to the correct group
  const [originalShift, desiredShift] = await Promise.all([
    prisma.shift.findFirst({
      where: { id: originalShiftId, groupId },
    }),
    prisma.shift.findFirst({
      where: { id: desiredShiftId, groupId },
    }),
  ]);

  if (!originalShift || !desiredShift) {
    throw new Error('Invalid shift IDs');
  }

  // Verify requester is assigned to original shift
  if (originalShift.assignedUserId !== requesterId) {
    throw new Error('User not assigned to original shift');
  }

  // Create the shift swap request
  const swap = await prisma.shiftSwap.create({
    data: {
      requesterId,
      groupId,
      originalShiftId,
      desiredShiftId,
      status: 'pending',
    },
    include: {
      requester: {
        select: {
          username: true,
        },
      },
    },
  });

  // Notify relevant users
  await prisma.notification.createMany({
    data: [
      {
        userId: desiredShift.assignedUserId,
        type: 'SHIFT_SWAP_REQUESTED',
        message: `${swap.requester.username} has requested to swap shifts with you`,
        metadata: { swapId: swap.id },
      },
      // Notify admins/managers
      // You'll need to implement the logic to determine who should be notified
    ],
  });

  return swap;
}
