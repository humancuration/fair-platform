import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { FaChartLine, FaClock, FaHeadphones, FaShare } from "react-icons/fa";
import { formatDuration } from "~/utils/formatters";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from 'chart.js';
import { getPlaylistStats } from "~/models/playlist.server";

interface PlaylistStats {
  playCount: number;
  totalDuration: number;
  uniqueListeners: number;
  shareCount: number;
  listenerHistory: Array<{
    date: string;
    count: number;
  }>;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const stats = await getPlaylistStats(params.playlistId);
  return json({ stats });
};

export function PlaylistAnalytics() {
  const { stats } = useLoaderData<typeof loader>();

  const chartData = {
    labels: stats.listenerHistory.map((h: { date: string }) => h.date),
    datasets: [
      {
        label: 'Listeners',
        data: stats.listenerHistory.map((h: { count: number }) => h.count),
        fill: true,
        borderColor: '#43cea2',
        backgroundColor: 'rgba(67, 206, 162, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6">
      <h2 className="text-2xl mb-4">Playlist Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white/5 rounded-lg p-4 text-center"
        >
          <FaHeadphones className="mx-auto mb-2" />
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            {stats.playCount}
          </div>
          <div>Total Plays</div>
        </motion.div>

        {/* Add other stat cards */}
      </div>

      <div className="h-[300px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
