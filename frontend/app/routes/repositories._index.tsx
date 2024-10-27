import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getRepositories } from "~/services/repository.server";
import { RepositoryList } from "~/components/repository/RepositoryList";
import { SearchBar } from "~/components/repository/SearchBar";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("search") || "";
  
  const repositories = await getRepositories();
  
  return json({ 
    repositories: repositories.filter(repo => 
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  });
}

export default function RepositoriesPage() {
  const { repositories } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (term: string) => {
    setSearchParams(prev => {
      if (term) {
        prev.set("search", term);
      } else {
        prev.delete("search");
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-semibold mb-6">Repositories</h1>
      <SearchBar 
        defaultValue={searchParams.get("search") || ""}
        onSearch={handleSearch}
      />
      <RepositoryList repositories={repositories} />
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-50 text-red-900 rounded-lg">
      <h1 className="text-lg font-bold">Error</h1>
      <p>Failed to load repositories. Please try again later.</p>
    </div>
  );
}
