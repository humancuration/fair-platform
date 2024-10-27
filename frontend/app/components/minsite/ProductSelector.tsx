import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import type { Product } from "~/types/minsite";

interface ProductSelectorProps {
  onSelect: (products: Product[]) => void;
  maxProducts?: number;
}

export function ProductSelector({ onSelect, maxProducts = Infinity }: ProductSelectorProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const fetcher = useFetcher<{ products: Product[] }>();

  // Use fetcher.load instead of useQuery
  const handleSearch = (value: string) => {
    setSearch(value);
    fetcher.load(`/api/products/search?q=${value}`);
  };

  // Rest of the component remains the same but uses fetcher.data instead of data
  return (
    <div className="p-4">
      {/* Component JSX remains the same */}
    </div>
  );
}
