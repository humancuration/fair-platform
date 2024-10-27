import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { BarChart2, Clock, Award, TrendingUp, Star, Users, BookOpen } from "react-feather";
import AnalyticsChart from "~/components/dashboard/analytics/AnalyticsChart";

interface ReviewerMetrics {
  overall: {
    totalReviews: number;
    averageScore: number;
    responseTime: number;
    acceptanceRate: number;
    thoroughnessScore: number;
    constructivenessScore: number;
  };
  expertise: {
    field: string;
    level: number;
    reviewCount: number;
    impactScore: number;
  }[];
  trends: {
    dates: string[];
    scores: number[];
    responseTimes: number[];
    thoroughness: number[];
  };
  achievements: {
    id: string;
    name: string;
    description: string;
    dateEarned: string;
    icon: string;
    rarity: "common" | "rare" | "epic" | "legendary";
  }[];
}

const funMessages = {
  highScore: "You're absolutely crushing it! 🌟",
  fastResponse: "Speed AND quality? We stan! ⚡",
  thorough: "The attention to detail though! 🔍",
  consistent: "Your consistency is everything! 💫",
  improving: "We love this growth journey! 📈"
};

export function ReviewerPerformanceDashboard() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const fetcher = useFetcher<ReviewerMetrics>();

  return (
    <div className="reviewer-performance p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Reviewer Performance ✨
          </h2>
          <p className="text-gray-600 mt-1">
            {fetcher.data?.overall.averageScore > 4.5 ? funMessages.highScore :
             fetcher.data?.overall.responseTime < 48 ? funMessages.fastResponse :
             fetcher.data?.overall.thoroughnessScore > 90 ? funMessages.thorough :
             funMessages.improving}
          </p>
        </div>

        <div className="flex gap-2">
          {["week", "month", "year"].map((t) => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeframe(t as typeof timeframe)}
              className={`px-4 py-2 rounded-full ${
                timeframe === t
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Reviews</p>
              <h3 className="text-2xl font-bold mt-1">
                {fetcher.data?.overall.totalReviews}
              </h3>
            </div>
            <BookOpen className="text-purple-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            ↑ 12% this month
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Average Score</p>
              <h3 className="text-2xl font-bold mt-1">
                {fetcher.data?.overall.averageScore.toFixed(1)}/5.0
              </h3>
            </div>
            <Star className="text-yellow-500" />
          </div>
          <div className="mt-2 text-sm text-blue-600">
            Top 10% of reviewers
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Response Time</p>
              <h3 className="text-2xl font-bold mt-1">
                {fetcher.data?.overall.responseTime}h
              </h3>
            </div>
            <Clock className="text-green-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            Faster than average
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Thoroughness</p>
              <h3 className="text-2xl font-bold mt-1">
                {fetcher.data?.overall.thoroughnessScore}%
              </h3>
            </div>
            <Award className="text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-purple-600">
            "Exceptional detail"
          </div>
        </motion.div>
      </div>

      {/* Expertise Areas */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Expertise Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fetcher.data?.expertise.map((area, index) => (
            <motion.div
              key={area.field}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white rounded-lg shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{area.field}</h4>
                <span className="text-sm text-gray-500">
                  {area.reviewCount} reviews
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Expertise Level</span>
                    <span>{area.level}/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(area.level / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Impact Score</span>
                  <span>{area.impactScore}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-bold mb-4">Review Quality Trend</h3>
          <AnalyticsChart
            data={{
              labels: fetcher.data?.trends.dates || [],
              values: fetcher.data?.trends.scores || []
            }}
            type="line"
            height={300}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-bold mb-4">Response Time Trend</h3>
          <AnalyticsChart
            data={{
              labels: fetcher.data?.trends.dates || [],
              values: fetcher.data?.trends.responseTimes || []
            }}
            type="line"
            height={300}
          />
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-bold mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fetcher.data?.achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg text-center"
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h4 className="font-medium">{achievement.name}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {achievement.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Earned {new Date(achievement.dateEarned).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
