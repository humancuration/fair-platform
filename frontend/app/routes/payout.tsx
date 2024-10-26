import { json, type LoaderFunction, type ActionFunction } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';
import React from 'react';
import { prisma } from '../db.server';
import { requireUser } from '../auth.server';
import TextInput from '../components/forms/TextInput';
import Button from '../components/common/Button';
import type { PayoutStatus } from '../types';

interface LoaderData {
  pendingPayouts: number;
  totalEarnings: number;
  recentPayouts: Array<{
    id: string;
    amount: number;
    status: PayoutStatus;
    createdAt: Date;
  }>;
}

interface ActionData {
  success?: boolean;
  error?: string;
  payoutId?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  const [pendingPayouts, totalEarnings, recentPayouts] = await Promise.all([
    prisma.payout.count({
      where: {
        creatorId: user.id,
        status: 'pending'
      }
    }),
    prisma.payout.aggregate({
      where: {
        creatorId: user.id,
        status: 'completed'
      },
      _sum: {
        amount: true
      }
    }),
    prisma.payout.findMany({
      where: {
        creatorId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true
      }
    })
  ]);

  return json<LoaderData>({
    pendingPayouts,
    totalEarnings: totalEarnings._sum.amount || 0,
    recentPayouts
  });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const formData = await request.formData();
  const amount = Number(formData.get('amount'));

  try {
    if (amount < 100) {
      throw new Error('Minimum payout amount is $100');
    }

    const payout = await prisma.payout.create({
      data: {
        amount,
        status: 'pending',
        creatorId: user.id
      }
    });

    return json<ActionData>({ 
      success: true,
      payoutId: payout.id 
    });
  } catch (error) {
    console.error('Failed to initiate payout:', error);
    return json<ActionData>({ 
      error: error instanceof Error ? error.message : 'Failed to initiate payout'
    }, { status: 400 });
  }
};

export default function PayoutRoute() {
  const { pendingPayouts, totalEarnings, recentPayouts } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Payouts</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Total Earnings</h3>
            <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Pending Payouts</h3>
            <p className="text-2xl font-bold">{pendingPayouts}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Request Payout</h2>
          <Form method="post" className="space-y-4">
            <TextInput
              label="Amount"
              name="amount"
              type="number"
              min="100"
              step="0.01"
              required
            />
            <Button type="submit">Request Payout</Button>
          </Form>

          {actionData?.error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded">
              {actionData.error}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Payouts</h2>
          <div className="space-y-4">
            {recentPayouts.map(payout => (
              <div 
                key={payout.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <p className="font-medium">${payout.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(payout.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  payout.status === 'completed' ? 'bg-green-100 text-green-800' :
                  payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {payout.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
