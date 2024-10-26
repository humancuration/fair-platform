import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getVisualizationData } from '~/services/visualization.server';
import DataChart from '~/components/visualization/DataChart';
import NetworkGraph from '~/components/visualization/NetworkGraph';

export const loader: LoaderFunction = async ({ params }) => {
  const visualization = await getVisualizationData(params.id);
  if (!visualization) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ visualization });
};

export default function VisualizationRoute() {
  const { visualization } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Visualization: {visualization.id}
      </h1>

      {visualization.type === 'chart' && (
        <DataChart
          data={visualization.data}
          config={visualization.config}
          type={visualization.config.chartType}
        />
      )}

      {visualization.type === 'network' && (
        <NetworkGraph
          nodes={visualization.data.nodes}
          edges={visualization.data.edges}
          options={visualization.config}
        />
      )}
    </div>
  );
}
