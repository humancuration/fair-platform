import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { prisma } from "~/db.server";
import { ProductList } from "~/components/marketplace/ProductList";
import { SearchBar } from "~/components/marketplace/SearchBar";
import { FilterSidebar } from "~/components/marketplace/FilterSidebar";
import { RecommendationCarousel } from "~/components/marketplace/RecommendationCarousel";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const category = url.searchParams.get("category");
  const sortOption = url.searchParams.get("sort") || "price-asc";
  const searchTerm = url.searchParams.get("search") || "";

  const products = await prisma.product.findMany({
    where: {
      ...(category && { category }),
      ...(searchTerm && {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      vendor: {
        select: {
          name: true,
          sustainabilityRating: true,
        },
      },
    },
    orderBy: {
      ...(sortOption === "price-asc" && { price: "asc" }),
      ...(sortOption === "price-desc" && { price: "desc" }),
      ...(sortOption === "name-asc" && { name: "asc" }),
      ...(sortOption === "name-desc" && { name: "desc" }),
    },
    skip: (page - 1) * 12,
    take: 12,
  });

  const recommendations = await prisma.product.findMany({
    where: { featured: true },
    take: 10,
  });

  return json({ products, recommendations, page });
}

export default function MarketplacePage() {
  const { products, recommendations, page } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (term: string) => {
    setSearchParams(prev => {
      if (term) {
        prev.set("search", term);
      } else {
        prev.delete("search");
      }
      prev.set("page", "1");
      return prev;
    });
  };

  const handleFilterChange = (filters: any) => {
    setSearchParams(prev => {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          prev.set(key, value.toString());
        } else {
          prev.delete(key);
        }
      });
      prev.set("page", "1");
      return prev;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Marketplace</h1>
      
      <RecommendationCarousel products={recommendations} />

      <div className="mb-8">
        <SearchBar 
          defaultValue={searchParams.get("search") || ""}
          onSearch={handleSearch} 
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <FilterSidebar 
            onFilterChange={handleFilterChange}
            currentCategory={searchParams.get("category")}
            currentSort={searchParams.get("sort")}
          />
        </div>
        <div className="w-full md:w-3/4">
          <ProductList products={products} />
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-50 text-red-900 rounded-lg">
      <h1 className="text-lg font-bold">Error</h1>
      <p>Failed to load marketplace. Please try again later.</p>
    </div>
  );
}
