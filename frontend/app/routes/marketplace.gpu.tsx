import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { prisma } from "~/db.server";
import { requireUserId } from "~/utils/auth.server";

interface GPUListing {
  id: string;
  name: string;
  specs: string;
  pricePerHour: number;
  available: boolean;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const listings = await prisma.gpuListing.findMany({
    where: { available: true },
    orderBy: { pricePerHour: 'asc' },
  });
  
  return json({ listings });
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const gpuId = formData.get("gpuId");

  if (!gpuId) {
    return json({ error: "GPU ID is required" }, { status: 400 });
  }

  // Create rental record
  const rental = await prisma.gpuRental.create({
    data: {
      userId,
      gpuListingId: gpuId as string,
      status: 'active',
    },
  });

  return json({ success: true, rental });
}

export default function GPUMarketplacePage() {
  const { listings } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">GPU Marketplace</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((gpu) => (
          <div key={gpu.id} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2">{gpu.name}</h3>
            <p className="text-gray-600 mb-4">{gpu.specs}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">
                ${gpu.pricePerHour.toFixed(2)}/hr
              </span>
              <Form method="post">
                <input type="hidden" name="gpuId" value={gpu.id} />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Rent Now
                </button>
              </Form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-50 text-red-900 rounded-lg">
      <h1 className="text-lg font-bold">Error</h1>
      <p>Failed to load GPU listings. Please try again later.</p>
    </div>
  );
}
