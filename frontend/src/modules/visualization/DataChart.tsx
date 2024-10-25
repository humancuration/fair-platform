import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface DataPoint {
  date: Date;
  value: number;
  category?: string;
}

interface ChartConfig {
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  animate?: boolean;
}

interface DataChartProps {
  data: DataPoint[];
  config?: ChartConfig;
  type: 'line' | 'bar' | 'scatter' | 'area';
}

const DataChart: React.FC<DataChartProps> = ({ 
  data, 
  config = {}, 
  type 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const {
    width = 600,
    height = 400,
    margin = { top: 20, right: 30, bottom: 30, left: 40 },
    xAxisLabel = 'Date',
    yAxisLabel = 'Value',
    color = '#4299e1',
    animate = true
  } = config;

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) as number])
      .range([height - margin.bottom, margin.top]);

    // Create SVG
    const svg = d3.select(svgRef.current);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Add labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .text(xAxisLabel);

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .text(yAxisLabel);

    // Draw chart based on type
    switch (type) {
      case 'line': {
        const line = d3.line<DataPoint>()
          .x(d => xScale(d.date))
          .y(d => yScale(d.value));

        const path = svg.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 2)
          .attr('d', line);

        if (animate) {
          const length = path.node()?.getTotalLength() || 0;
          path.attr('stroke-dasharray', `${length} ${length}`)
            .attr('stroke-dashoffset', length)
            .transition()
            .duration(2000)
            .attr('stroke-dashoffset', 0);
        }
        break;
      }
      case 'bar': {
        svg.selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('x', d => xScale(d.date))
          .attr('y', height - margin.bottom)
          .attr('width', width / data.length - 2)
          .attr('height', 0)
          .attr('fill', color)
          .transition()
          .duration(animate ? 1000 : 0)
          .attr('y', d => yScale(d.value))
          .attr('height', d => height - margin.bottom - yScale(d.value));
        break;
      }
      // Add other chart types as needed
    }
  }, [data, type, config]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-auto"
      />
    </motion.div>
  );
};

export default DataChart;
