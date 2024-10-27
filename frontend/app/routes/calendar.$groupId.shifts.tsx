import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ShiftSwapBoard } from "~/components/calendar/ShiftSwapBoard";

export async function loader({ params }: LoaderFunctionArgs) {
  const { groupId } = params;
  
  // Fetch shift swaps from your backend
  const swaps = await getShiftSwaps(groupId);
  
  return json({ swaps });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { groupId } = params;
  const formData = await request.formData();
  const intent = formData.get("intent");
  const swapId = formData.get("swapId");

  if (!swapId) {
    return json({ error: "Swap ID is required" }, { status: 400 });
  }

  switch (intent) {
    case "approve":
      await approveShiftSwap(swapId);
      return json({ success: true });

    case "reject":
      await rejectShiftSwap(swapId);
      return json({ success: true });

    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
}

export default function ShiftSwapsRoute() {
  const { swaps } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8">
      <ShiftSwapBoard swaps={swaps} groupId={params.groupId} />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  
  return (
    <div className="p-4 bg-red-50 text-red-900 rounded-lg">
      <h1 className="text-lg font-bold">Error</h1>
      <p>{error instanceof Error ? error.message : "An unexpected error occurred"}</p>
    </div>
  );
}
