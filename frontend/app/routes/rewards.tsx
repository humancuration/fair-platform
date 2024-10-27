import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUserId } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const rewards = await prisma.reward.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
  return json({ rewards });
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const rewardId = formData.get("rewardId");

  if (intent === "redeem" && rewardId) {
    return await prisma.reward.update({
      where: { id: rewardId as string },
      data: {
        redeemedBy: {
          connect: { id: userId }
        }
      }
    });
  }

  return json({ error: "Invalid request" }, { status: 400 });
}
