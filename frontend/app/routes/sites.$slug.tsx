import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/db.server";
import { trackMinsiteAnalytics } from "~/services/minsite.server";
import { MinsitePreview } from "~/components/minsite/MinsitePreview";

export async function loader({ params }: LoaderFunctionArgs) {
  const minsite = await prisma.minsite.findUnique({
    where: { publishedSlug: params.slug },
    include: {
      components: true,
      analytics: {
        orderBy: { date: "desc" },
        take: 1
      }
    }
  });

  if (!minsite || !minsite.isPublished) {
    throw new Response("Not Found", { status: 404 });
  }

  // Track the view
  await trackMinsiteAnalytics(minsite.id, { views: 1, visitors: 1 });

  return json({ minsite });
}

export default function PublishedMinsitePage() {
  const { minsite } = useLoaderData<typeof loader>();

  return (
    <div className="published-minsite">
      <MinsitePreview
        title={minsite.title}
        content={minsite.content as string}
        customCSS={minsite.customCSS || ""}
        components={minsite.components}
      />
    </div>
  );
}
