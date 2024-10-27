import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getRepository, updateRepository, deleteRepository } from "~/services/repository.server";
import { RepositoryDetail } from "~/components/repository/RepositoryDetail";
import { requireUserId } from "~/utils/auth.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const repository = await getRepository(params.id!);
  if (!repository) {
    throw new Response("Repository not found", { status: 404 });
  }
  return json({ repository });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "update":
      const updateData = JSON.parse(formData.get("data") as string);
      await updateRepository(params.id!, updateData);
      return json({ success: true });

    case "delete":
      await deleteRepository(params.id!);
      return redirect("/repositories");

    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
}

export default function RepositoryDetailPage() {
  const { repository } = useLoaderData<typeof loader>();
  return <RepositoryDetail repository={repository} />;
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-50 text-red-900 rounded-lg">
      <h1 className="text-lg font-bold">Error</h1>
      <p>Unable to load repository details. Please try again later.</p>
    </div>
  );
}
