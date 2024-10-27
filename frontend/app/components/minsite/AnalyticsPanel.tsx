import { useState } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from "react-chartjs-2";
import type { Analytics } from "~/types/models";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsPanelProps {
  data: {
    labels: string[];
    views: number[];
    conversions: number[];
    revenue: number[];
    totals: {
      views: number;
      conversions: number;
      revenue: number;
    };
  };
  timeRange: "day" | "week" | "month" | "year";
  onTimeRangeChange: (range: "day" | "week" | "month" | "year") => void;
}

export function AnalyticsPanel({ data, timeRange, onTimeRangeChange }: AnalyticsPanelProps) {
  const [activeMetric, setActiveMetric] = useState<"views" | "conversions" | "revenue">("views");

  const metrics = {
    views: {
      label: "Page Views",
      color: "rgb(59, 130, 246)",
      data: data.views
    },
    conversions: {
      label: "Conversions",
      color: "rgb(16, 185, 129)",
      data: data.conversions
    },
    revenue: {
      label: "Revenue",
      color: "rgb(245, 158, 11)",
      data: data.revenue
    }
  };

  const chartData = {
    labels: data.labels,
    datasets: [{
      label: metrics[activeMetric].label,
      data: metrics[activeMetric].data,
      borderColor: metrics[activeMetric].color,
      backgroundColor: `${metrics[activeMetric].color}33`,
      tension: 0.4
    }]
  };

  return (
    <div className="analytics-panel p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          {(["day", "week", "month", "year"] as const).map(range => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`px-3 py-1 rounded ${
                timeRange === range 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="space-x-2">
          {(Object.keys(metrics) as Array<keyof typeof metrics>).map(metric => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric)}
              className={`px-3 py-1 rounded ${
                activeMetric === metric 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {metrics[metric].label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <Line data={chartData} options={{ maintainAspectRatio: false }} />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {(Object.keys(metrics) as Array<keyof typeof metrics>).map(metric => (
          <motion.div
            key={metric}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-lg bg-gray-50"
          >
            <h4 className="text-sm text-gray-500">{metrics[metric].label}</h4>
            <p className="text-2xl font-bold" style={{ color: metrics[metric].color }}>
              {metric === "revenue" ? `$${data.totals[metric]}` : data.totals[metric]}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
