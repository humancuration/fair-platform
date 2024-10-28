import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaUser, FaHeart, FaFire, FaBrain, FaGem, FaChartLine, FaStar } from "react-icons/fa";
import { getCurators } from "~/models/curator.server";
import type { Curator, CuratorFilter } from "~/types/curator";
import { useState } from "react";
import { FilterSection } from "./components/FilterSection";
import { CuratorCard } from "./components/CuratorCard";
import { CuratorTrendingCard } from "./components/CuratorTrendingCard";
import { CuratorGrid } from "./components/CuratorGrid";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const filter = (url.searchParams.get("filter") || "all") as CuratorFilter;
  const sortBy = url.searchParams.get("sort") || "rating";

  const curators = await getCurators(filter, sortBy);
  return json({ curators });
};

export function CuratorDiscovery() {
  const { curators } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [filter, setFilter] = useState<CuratorFilter>("all");

  const handleFollow = async (curatorId: string) => {
    fetcher.submit(
      { action: "follow", curatorId },
      { method: "post" }
    );
  };

  const handleFilterChange = (newFilter: CuratorFilter) => {
    setFilter(newFilter);
    fetcher.submit(
      { filter: newFilter },
      { method: "get", action: "?index" }
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filter === 'all' && (
          <TrendingSection curators={curators.slice(0, 3)} />
        )}

        <FilterSection 
          activeFilter={filter} 
          onFilterChange={handleFilterChange} 
        />

        <CuratorGrid>
          <AnimatePresence>
            {curators.map((curator) => (
              <CuratorCard
                key={curator.id}
                curator={curator}
                onFollow={() => handleFollow(curator.id)}
              />
            ))}
          </AnimatePresence>
        </CuratorGrid>
      </motion.div>
    </div>
  );
}

// Subcomponents remain mostly the same but with proper types
function TrendingSection({ curators }: { curators: Curator[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaFire className="text-orange-500" /> Trending Curators
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {curators.map(curator => (
          <CuratorTrendingCard key={curator.id} curator={curator} />
        ))}
      </div>
    </motion.section>
  );
}

// Add other subcomponents with proper types...
