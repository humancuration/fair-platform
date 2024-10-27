import { motion } from "framer-motion";
import { useFetcher } from "@remix-run/react";
import { BarChart2, Users, Clock, Award, TrendingUp } from "react-feather";
import AnalyticsChart from "~/components/dashboard/analytics/AnalyticsChart";

interface ReviewMetrics {
  totalReviews: number;
  averageResponseTime: number;
  acceptanceRate: number;
  activeReviewers: number;
  qualityScores: {
    methodology: number;
    clarity: number;
    significance: number;
    reproducibility: number;
  };
  trends: {
    labels: string[];
    reviews: number[];
    reviewers: number[];
    responseTime: number[];
  };
  topFields: Array<{
    name: string;
    count: number;
    growth: number;
  }>;
}

const funMessages = {
  highQuality: "The science is sciencing! 🧬",
  fastResponse: "Speed running peer review! ⚡",
  goodGrowth: "The community is thriving! 🌱",
  strongEngagement: "Knowledge party happening! 🎉"
};

export function ReviewAnalytics() {
  const fetcher = useFetcher<ReviewMetrics>();
  const metrics = fetcher.data;

  if (!metrics) return null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Review Analytics ✨
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600"
        >
          {metrics.qualityScores.methodology > 8 ? funMessages.highQuality :
           metrics.averageResponseTime < 72 ? funMessages.fastResponse :
           metrics.trends.reviewers[metrics.trends.reviewers.length - 1] > 100 ? funMessages.goodGrowth :
           funMessages.strongEngagement}
        </motion.p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Reviews</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.totalReviews}</h3>
            </div>
            <BarChart2 className="text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Active Reviewers</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.activeReviewers}</h3>
            </div>
            <Users className="text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Avg Response Time</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.averageResponseTime}h</h3>
            </div>
            <Clock className="text-green-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Acceptance Rate</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.acceptanceRate}%</h3>
            </div>
            <Award className="text-yellow-500" />
          </div>
        </motion.div>
      </div>

      {/* Quality Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-bold mb-4">Review Quality Scores</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(metrics.qualityScores).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeDasharray={`${value * 10}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {value}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 capitalize">{key}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold mb-4">Review Activity</h3>
          <AnalyticsChart
            data={{
              labels: metrics.trends.labels,
              values: metrics.trends.reviews
            }}
            type="line"
            height={300}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold mb-4">Reviewer Growth</h3>
          <AnalyticsChart
            data={{
              labels: metrics.trends.labels,
              values: metrics.trends.reviewers
            }}
            type="bar"
            height={300}
          />
        </motion.div>
      </div>

      {/* Top Fields */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-bold mb-4">Top Research Fields</h3>
        <div className="space-y-4">
          {metrics.topFields.map((field) => (
            <div key={field.name} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{field.name}</p>
                <p className="text-sm text-gray-500">{field.count} reviews</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className={field.growth > 0 ? "text-green-500" : "text-red-500"} />
                <span className={field.growth > 0 ? "text-green-500" : "text-red-500"}>
                  {field.growth}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
