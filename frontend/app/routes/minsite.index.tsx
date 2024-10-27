import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import { prisma } from "~/utils/db.server";
import { motion } from "framer-motion";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  
  const minsites = await prisma.minsite.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      analytics: {
        orderBy: { date: "desc" },
        take: 1
      }
    }
  });

  return json({ minsites });
}

export default function MinsiteIndexPage() {
  const { minsites } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Minsites</h1>
        <Link
          to="/minsite/new"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create New Minsite
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {minsites.map((minsite) => (
          <motion.div
            key={minsite.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <h2 className="text-xl font-semibold mb-2">{minsite.title}</h2>
            <div className="text-sm text-gray-500 mb-4">
              Template: {minsite.template}
            </div>
            <div className="flex justify-between items-center text-sm">
              <div>
                Views: {minsite.analytics[0]?.views || 0}
              </div>
              <Link
                to={`/minsite/${minsite.id}`}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
