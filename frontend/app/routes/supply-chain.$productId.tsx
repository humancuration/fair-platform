import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getSupplyChainData } from '~/services/visualization.server';
import SupplyChainGraph from '~/components/visualization/SupplyChainGraph';

export const loader: LoaderFunction = async ({ params }) => {
  const data = await getSupplyChainData(params.productId);
  if (!data) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ data });
};

export default function SupplyChainRoute() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Supply Chain Visualization
      </h1>

      <SupplyChainGraph
        nodes={data.nodes}
        links={data.links}
        onNodeClick={(node) => {
          console.log('Node clicked:', node);
        }}
        onPathHighlight={(path) => {
          console.log('Path highlighted:', path);
        }}
      />
    </div>
  );
}
