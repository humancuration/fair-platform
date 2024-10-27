import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import { prisma } from "~/utils/db.server";
import { MediaManager } from "~/components/minsite/MediaManager";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  
  const uploads = await prisma.upload.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  return json({ uploads });
}

export default function MediaRoute() {
  const { uploads } = useLoaderData<typeof loader>();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Media Library</h1>
      <MediaManager 
        uploads={uploads}
        onSelect={(upload) => {
          // Handle selection
          console.log("Selected upload:", upload);
        }}
      />
    </div>
  );
}
