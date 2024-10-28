import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCode, FaTable, FaChartBar, FaChartPie, 
  FaChartLine, FaExpand, FaCompress, FaCopy 
} from "react-icons/fa";
import ReactJson from "react-json-view";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";

type VisualizationType = 'json' | 'table' | 'bar' | 'line' | 'pie';

interface DataVisualizerProps {
  data: any;
  type?: VisualizationType;
  interactive?: boolean;
  theme?: 'light' | 'dark';
  maxHeight?: string;
  onEdit?: (edit: { updated_src: any }) => void;
}

export function DataVisualizer({
  data,
  type = 'json',
  interactive = true,
  theme = 'dark',
  maxHeight = '500px',
  onEdit,
}: DataVisualizerProps) {
  const [visualType, setVisualType] = useState<VisualizationType>(type);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isChartable = (data: any) => {
    return Array.isArray(data) && 
           data.length > 0 && 
           typeof data[0] === 'object' &&
           !Array.isArray(data[0]);
  };

  const renderVisualizer = () => {
    switch (visualType) {
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  {Object.keys(data[0]).map(key => (
                    <th key={key} className="px-4 py-2 text-left text-sm font-semibold">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {data.map((row: any, i: number) => (
                  <tr key={i}>
                    {Object.values(row).map((value: any, j: number) => (
                      <td key={j} className="px-4 py-2 text-sm">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={Object.keys(data[0])[0]} />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                }} 
              />
              <Legend />
              {Object.keys(data[0])
                .slice(1)
                .map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={`hsl(${index * 60}, 70%, 60%)`}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={Object.keys(data[0])[0]} />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                }} 
              />
              <Legend />
              {Object.keys(data[0])
                .slice(1)
                .map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={`hsl(${index * 60}, 70%, 60%)`}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey={Object.keys(data[0])[1]}
                nameKey={Object.keys(data[0])[0]}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {data.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ReactJson
            src={data}
            theme={theme === 'dark' ? 'monokai' : 'rjv-default'}
            style={{ padding: '1rem' }}
            enableClipboard={false}
            displayDataTypes={false}
            onEdit={interactive ? onEdit : false}
            onAdd={interactive ? onEdit : false}
            onDelete={interactive ? onEdit : false}
          />
        );
    }
  };

  return (
    <motion.div
      layout
      className="relative rounded-lg overflow-hidden bg-gray-800"
      animate={{ maxHeight: isExpanded ? 'none' : maxHeight }}
    >
      {/* Toolbar */}
      <div className="absolute right-2 top-2 flex gap-2 z-10">
        {isChartable(data) && (
          <div className="flex gap-1 bg-gray-900/80 rounded-lg backdrop-blur-sm p-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setVisualType('json')}
              className={`p-2 rounded ${visualType === 'json' ? 'bg-purple-500' : ''}`}
              title="JSON View"
            >
              <FaCode />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setVisualType('table')}
              className={`p-2 rounded ${visualType === 'table' ? 'bg-purple-500' : ''}`}
              title="Table View"
            >
              <FaTable />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setVisualType('bar')}
              className={`p-2 rounded ${visualType === 'bar' ? 'bg-purple-500' : ''}`}
              title="Bar Chart"
            >
              <FaChartBar />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setVisualType('line')}
              className={`p-2 rounded ${visualType === 'line' ? 'bg-purple-500' : ''}`}
              title="Line Chart"
            >
              <FaChartLine />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setVisualType('pie')}
              className={`p-2 rounded ${visualType === 'pie' ? 'bg-purple-500' : ''}`}
              title="Pie Chart"
            >
              <FaChartPie />
            </motion.button>
          </div>
        )}
        <div className="flex gap-1 bg-gray-900/80 rounded-lg backdrop-blur-sm p-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="p-2 rounded"
            title={isCopied ? 'Copied!' : 'Copy data'}
          >
            <FaCopy className={isCopied ? 'text-green-400' : ''} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded"
          >
            {isExpanded ? <FaCompress /> : <FaExpand />}
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-12">
        {renderVisualizer()}
      </div>
    </motion.div>
  );
}
