import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion } from "framer-motion";
import { Container, Typography } from "@mui/material";
import { FaFire } from "react-icons/fa";
import { getCurators } from "~/models/curator.server";
import type { Curator, CuratorFilter } from "~/types/curator";
import { useState } from "react";
import { FilterSection } from "~/components/playlist/curator/components/FilterSection";
import { CuratorCard } from "~/components/playlist/curator/components/CuratorCard";
import { CuratorTrendingCard } from "~/components/playlist/curator/components/CuratorTrendingCard";
import { CuratorGrid } from "~/components/playlist/curator/components/CuratorGrid";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const filter = (url.searchParams.get("filter") || "all") as CuratorFilter;
  const sortBy = url.searchParams.get("sort") || "rating";

  const curators = await getCurators(filter, sortBy);
  return json({ curators });
};

export default function CuratorDiscoveryRoute() {
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
    <Container maxWidth="xl" className="py-8">
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
          {curators.map((curator) => (
            <CuratorCard
              key={curator.id}
              curator={curator}
              onFollow={() => handleFollow(curator.id)}
            />
          ))}
        </CuratorGrid>
      </motion.div>
    </Container>
  );
}

function TrendingSection({ curators }: { curators: Curator[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Typography variant="h4" className="mb-4 flex items-center gap-2">
        <FaFire className="text-orange-500" /> Trending Curators
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {curators.map(curator => (
          <CuratorTrendingCard key={curator.id} curator={curator} />
        ))}
      </div>
    </motion.section>
  );
}
