import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { Chart } from "chart.js";
import { 
  FaUsers, FaHandshake, FaLightbulb, FaMicrochip, 
  FaSeedling, FaGraduationCap, FaChartLine, FaGlobe 
} from "react-icons/fa";
import AnalyticsChart from "~/components/dashboard/analytics/AnalyticsChart";

interface EcosystemMetrics {
  patents: {
    total: number;
    active: number;
    revenue: number;
    contributors: number;
    implementations: number;
    impact: {
      scientific: number;
      economic: number;
      social: number;
    };
  };
  compute: {
    totalGPUs: number;
    activeJobs: number;
    utilization: number;
    revenue: number;
    topProjects: {
      id: string;
      name: string;
      usage: number;
    }[];
  };
  funding: {
    totalDistributed: number;
    activeProjects: number;
    categories: Record<string, number>;
    topFunded: {
      id: string;
      title: string;
      amount: number;
      category: string;
    }[];
  };
  ubi: {
    totalPool: number;
    recipients: number;
    averageAmount: number;
    distribution: {
      science: number;
      compute: number;
      content: number;
      other: number;
    };
  };
  collaboration: {
    activeUsers: number;
    projects: number;
    connections: number;
    contributions: number;
    reputation: {
      average: number;
      distribution: number[];
    };
  };
  impact: {
    papers: number;
    citations: number;
    implementations: number;
    communities: number;
    sdgAlignment: Record<string, number>;
  };
}

interface TimeSeriesData {
  timestamp: string;
  value: number;
}

interface TrendData {
  daily: TimeSeriesData[];
  weekly: TimeSeriesData[];
  monthly: TimeSeriesData[];
  yearly: TimeSeriesData[];
}

const metricCategories = {
  overview: {
    icon: <FaChartLine className="text-2xl" />,
    title: "Ecosystem Overview",
    metrics: ["Total Value", "Active Users", "Projects", "Impact Score"]
  },
  patents: {
    icon: <FaLightbulb className="text-2xl" />,
    title: "Patent Metrics",
    metrics: ["Active Patents", "Revenue", "Implementations", "Contributors"]
  },
  compute: {
    icon: <FaMicrochip className="text-2xl" />,
    title: "Compute Resources",
    metrics: ["GPU Utilization", "Active Jobs", "Revenue", "Users"]
  },
  funding: {
    icon: <FaHandshake className="text-2xl" />,
    title: "Funding Flows",
    metrics: ["Total Distributed", "Active Projects", "Categories", "Success Rate"]
  },
  ubi: {
    icon: <FaUsers className="text-2xl" />,
    title: "UBI System",
    metrics: ["Pool Size", "Recipients", "Average Amount", "Distribution"]
  },
  impact: {
    icon: <FaGlobe className="text-2xl" />,
    title: "Impact Metrics",
    metrics: ["Papers", "Citations", "Communities", "SDG Alignment"]
  }
};

export function EcosystemAnalytics() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof metricCategories>("overview");
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "year">("month");
  const [metrics, setMetrics] = useState<EcosystemMetrics | null>(null);
  const [trends, setTrends] = useState<Record<string, TrendData>>({});
  const fetcher = useFetcher();

  return (
    <div className="ecosystem-analytics p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
            Ecosystem Analytics ✨
          </h2>
          <p className="text-gray-600 mt-1">Unified metrics for collective progress</p>
        </div>

        {/* Timeframe Selection */}
        <div className="flex gap-2">
          {["day", "week", "month", "year"].map(t => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeframe(t as typeof timeframe)}
              className={`px-3 py-1 rounded-full ${
                timeframe === t
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(metricCategories).map(([key, category]) => (
          <motion.div
            key={key}
            className={`p-4 rounded-xl cursor-pointer ${
              selectedCategory === key
                ? "bg-gradient-to-br from-green-100 to-blue-100 border-2 border-blue-500"
                : "bg-white border hover:border-blue-300"
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedCategory(key as keyof typeof metricCategories)}
          >
            <div className="text-blue-600 mb-2">{category.icon}</div>
            <h3 className="font-bold text-sm mb-2">{category.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Metrics Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Key Metrics */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
          <h3 className="font-bold mb-4">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            {metricCategories[selectedCategory].metrics.map((metric, index) => (
              <motion.div
                key={metric}
                className="bg-white rounded-lg p-4 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="text-sm text-gray-600 mb-1">{metric}</h4>
                <div className="text-xl font-bold">
                  {/* Dynamic metric value would go here */}
                  {Math.floor(Math.random() * 1000)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-bold mb-4">Trends</h3>
          <AnalyticsChart
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              values: [30, 40, 45, 50, 49, 60]
            }}
            type="line"
            height={200}
          />
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Impact Distribution */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-bold mb-4">Impact Distribution</h3>
          <AnalyticsChart
            data={{
              labels: ["Scientific", "Economic", "Social", "Environmental"],
              values: [40, 30, 20, 10]
            }}
            type="bar"
            height={200}
          />
        </div>

        {/* Network Activity */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-bold mb-4">Network Activity</h3>
          <AnalyticsChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              values: [65, 59, 80, 81, 56, 55, 40]
            }}
            type="line"
            height={200}
          />
        </div>

        {/* Resource Allocation */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-bold mb-4">Resource Allocation</h3>
          <AnalyticsChart
            data={{
              labels: ["Patents", "Compute", "Content", "Research", "Community"],
              values: [30, 25, 15, 20, 10]
            }}
            type="bar"
            height={200}
          />
        </div>
      </div>
    </div>
  );
}
