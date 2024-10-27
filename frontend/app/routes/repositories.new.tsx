import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { CreateRepositoryForm } from "~/components/repository/CreateRepositoryForm";
import { createRepository } from "~/services/repository.server";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const isPrivate = formData.get("isPrivate") === "on";
  const lfsEnabled = formData.get("lfsEnabled") === "on";

  const repository = await createRepository(
    {
      name,
      description,
      isPrivate,
      lfsEnabled,
    },
    userId
  );

  return redirect(`/repositories/${repository.id}`);
}

export default function NewRepositoryPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Repository</h1>
      <CreateRepositoryForm />
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-50 text-red-900 rounded-lg">
      <h1 className="text-lg font-bold">Error</h1>
      <p>Failed to create repository. Please try again later.</p>
    </div>
  );
}
