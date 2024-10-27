import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import { prisma } from "~/utils/db.server";
import { LinkPageEditor } from "~/components/minsite/LinkPageEditor";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  
  const links = await prisma.affiliateLink.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  return json({ links });
}

export default function LinksRoute() {
  const { links } = useLoaderData<typeof loader>();
  return <LinkPageEditor initialLinks={links} />;
}
