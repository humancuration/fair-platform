import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { FileUploader } from "~/components/repository/FileUploader";
import { VersionHistory } from "~/components/repository/VersionHistory";
import { getRepository } from "~/services/repository.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const repository = await getRepository(params.id!);
  if (!repository) {
    throw new Response("Repository not found", { status: 404 });
  }

  // Fetch commit history
  const commits = await prisma.commit.findMany({
    where: { repositoryId: params.id },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return json({ repository, commits });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "upload":
      const file = formData.get("file") as File;
      // Handle file upload logic here
      return json({ success: true });

    case "revert":
      const commitId = formData.get("commitId");
      // Handle revert logic here
      return json({ success: true });

    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
}

export default function RepositoryFilesPage() {
  const { repository, commits } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-8">
      <FileUploader repoId={repository.id} />
      <VersionHistory 
        commits={commits}
        currentBranch={repository.defaultBranch}
      />
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-50 text-red-900 rounded-lg">
      <h1 className="text-lg font-bold">Error</h1>
      <p>Unable to load repository files. Please try again later.</p>
    </div>
  );
}
