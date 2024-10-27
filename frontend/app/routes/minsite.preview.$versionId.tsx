import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";
import { MinsitePreview } from "~/components/minsite/MinsitePreview";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  
  const version = await prisma.minsiteVersion.findUnique({
    where: { id: params.versionId },
    include: { minsite: true }
  });

  if (!version || version.minsite.userId !== userId) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ version });
}

export default function VersionPreviewPage() {
  const { version } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Version Preview</h1>
        <p className="text-gray-500">
          Created at: {new Date(version.createdAt).toLocaleString()}
        </p>
      </div>

      <MinsitePreview
        title={version.title}
        content={version.content as string}
        customCSS={version.customCSS || ""}
        components={[]}
      />
    </div>
  );
}
