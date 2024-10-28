import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';

Chart.register(...registerables);

interface ChartData {
  labels: string[];
  values: number[];
}

interface AnalyticsChartProps {
  data: ChartData;
  type: 'line' | 'bar';
  height?: number;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ 
  data, 
  type = 'line', 
  height = 300 
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type,
      data: {
        labels: data.labels,
        datasets: [
          {
            label: type === 'line' ? 'Trend' : 'Value',
            data: data.values,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            tension: 0.4,
            fill: type === 'line',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(156, 163, 175, 0.1)',
            },
            ticks: {
              color: 'rgba(156, 163, 175, 0.8)',
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: 'rgba(156, 163, 175, 0.8)',
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ height }}
    >
      <canvas ref={chartRef} />
    </motion.div>
  );
};

export default AnalyticsChart;
